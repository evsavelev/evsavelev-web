const { chromium, expect } = require("@playwright/test");
const fs = require("node:fs");

const base = process.env.QA_URL || "http://127.0.0.1:4194/evsavelev-web/";
const outDir = "qa/request-v4";
fs.mkdirSync(outDir, { recursive: true });

const widths = [360, 390, 430, 768, 1024, 1440, 1600, 1920, 2048];
const errors = [];
const failed = [];
const checks = [];

function attachNetwork(page) {
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => {
    if (m.type() === "error") errors.push("console: " + m.text());
  });
  page.on("response", r => {
    if (r.status() >= 400 && r.url().startsWith(new URL(base).origin)) {
      failed.push(r.status() + " " + r.url());
    }
  });
}

async function settle(page) {
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const imgs = [...document.images].filter(i => i.getClientRects().length);
    await Promise.all(imgs.map(i => {
      i.loading = "eager";
      return i.decode().catch(() => {});
    }));
  });
}

async function layoutState(page) {
  return page.evaluate(() => ({
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    brokenImages: [...document.images]
      .filter(i => i.getClientRects().length && !i.naturalWidth)
      .map(i => i.getAttribute("src")),
    missingAnchors: [...document.querySelectorAll('a[href^="#"]')]
      .map(a => a.getAttribute("href"))
      .filter(h => h && h !== "#" && !document.querySelector(h))
  }));
}

async function revealForVisualQA(page) {
  const items = page.locator(".reveal");
  const count = await items.count();
  for (let i = 0; i < count; i++) {
    await items.nth(i).scrollIntoViewIfNeeded();
    await page.waitForTimeout(45);
  }
  const leftover = await page.locator(".portfolio-js .reveal:not(.is-visible)").evaluateAll(elements =>
    elements.map(el => {
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        className: el.className,
        text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 180),
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        display: getComputedStyle(el).display,
        visibility: getComputedStyle(el).visibility
      };
    })
  );
  if (leftover.length) throw new Error("Unrevealed elements: " + JSON.stringify(leftover));
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  await page.waitForTimeout(250);
}

async function checkHome(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  attachNetwork(page);
  await page.goto(base, { waitUntil: "networkidle" });
  await settle(page);

  const layout = await layoutState(page);
  expect(layout.scrollWidth).toBeLessThanOrEqual(width);
  if (width >= 1600) {
    const wrapWidth = await page.locator(".wrap").first().evaluate(e => e.getBoundingClientRect().width);
    expect(wrapWidth).toBeGreaterThan(1450);
    const hero = await page.locator(".hero-grid").boundingBox();
    expect(hero.height).toBeLessThan(760);
  }
  expect(layout.brokenImages).toEqual([]);
  expect(layout.missingAnchors).toEqual([]);

  await expect(page.locator("h1")).toContainText("Создаю сайты");
  await expect(page.locator(".editorial-grid .project-card")).toHaveCount(8);
  await expect(page.locator(".price-list .price-item")).toHaveCount(5);
  await expect(page.locator(".hero-offer")).toContainText("−50%");
  await expect(page.locator(".hero-offer")).toContainText("31 декабря 2026");
  await expect(page.locator(".pricing-promo")).toContainText("Скидка 50%");
  for (const price of ["от 17 500 ₽","от 30 000 ₽","от 50 000 ₽","от 65 000 ₽","от 80 000 ₽"]) {
    await expect(page.locator(".price-value").filter({ hasText: price })).toHaveCount(1);
  }
  for (const oldPrice of ["от 35 000 ₽","от 60 000 ₽","от 100 000 ₽","от 130 000 ₽","от 160 000 ₽"]) {
    await expect(page.locator(".price-old").filter({ hasText: oldPrice })).toHaveCount(1);
  }

  const featuredCards = page.locator(".editorial-grid .project-card");
  for (let i = 0; i < await featuredCards.count(); i++) {
    const card = featuredCards.nth(i);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveClass(/is-visible/);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("#request-dialog")).toHaveCount(1);

  await page.screenshot({ path: outDir + "/hero-" + width + ".png", fullPage: false });

  if (width <= 1024) {
    await expect(page.locator(".menu-toggle")).toBeVisible();
    await page.locator(".menu-toggle").click();
    await expect(page.locator("#menu-dialog")).toBeVisible();
    await page.locator("#menu-dialog [data-close]").click();
    await expect(page.locator("#menu-dialog")).not.toBeVisible();
  } else {
    await expect(page.locator(".desktop-nav")).toBeVisible();
  }

  const heroCta = page.locator(".hero [data-service]").first();
  await heroCta.click();
  await expect(page.locator("#request-dialog")).toBeVisible();
  await expect(page.locator("#request-service")).toHaveValue("Бесплатное демо — 0 ₽");
  expect(await page.locator("#request-dialog").evaluate(e => e.scrollWidth <= e.clientWidth)).toBe(true);

  await page.locator('[data-channel="whatsapp"]').click();
  await expect(page.locator("#name-error")).toHaveText("Укажите ваше имя.");
  await expect(page.locator("#request-name")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#request-dialog")).not.toBeVisible();
  await expect(heroCta).toBeFocused();

  await revealForVisualQA(page);
  await page.screenshot({ path: outDir + "/home-" + width + ".png", fullPage: true });

  if ([390,1440,1920,2048].includes(width)) {
    for (const [name, selector] of [
      ["directions", "#directions"],
      ["projects", "#projects"],
      ["process", "#process"],
      ["cycle", ".full-cycle"],
      ["prices", "#prices"],
      ["about", "#about"],
      ["faq", "#faq"],
      ["contact", "#contact"]
    ]) {
      const section = page.locator(selector);
      if (await section.count()) {
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(120);
        await section.screenshot({ path: outDir + "/" + name + "-" + width + ".png" });
      }
    }
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  checks.push({ page: "home", width, layout });
  await page.close();
}

async function checkProjects(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  attachNetwork(page);
  await page.goto(base + "projects/", { waitUntil: "networkidle" });
  await settle(page);

  const layout = await layoutState(page);
  expect(layout.scrollWidth).toBeLessThanOrEqual(width);
  expect(layout.brokenImages).toEqual([]);
  expect(layout.missingAnchors).toEqual([]);

  await expect(page.locator(".projects-archive .project-card")).toHaveCount(10);
  const archiveCards = page.locator(".projects-archive .project-card");
  for (let i = 0; i < await archiveCards.count(); i++) {
    const card = archiveCards.nth(i);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveClass(/is-visible/);
  }
  await page.evaluate(() => window.scrollTo(0, 0));

  const hrefs = await page.locator("a[href]").evaluateAll(es => es.map(e => e.getAttribute("href")));
  for (const href of [
    "tel:+79088990088",
    "https://wa.me/79088990088",
    "https://t.me/+79088990088?profile",
    "mailto:evsavelev.region@gmail.com"
  ]) expect(hrefs).toContain(href);
  expect(hrefs.some(h => h && h.startsWith("https://max.ru/u/"))).toBe(true);

  if (width <= 1024) {
    await expect(page.locator(".menu-toggle")).toBeVisible();
    await page.locator(".menu-toggle").click();
    await expect(page.locator("#menu-dialog")).toBeVisible();
    await page.locator("#menu-dialog [data-close]").click();
  } else {
    await expect(page.locator(".desktop-nav")).toBeVisible();
  }

  await page.screenshot({ path: outDir + "/projects-hero-" + width + ".png", fullPage: false });
  await revealForVisualQA(page);
  await page.screenshot({ path: outDir + "/projects-" + width + ".png", fullPage: true });
  checks.push({ page: "projects", width, layout });
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const width of widths) await checkHome(browser, width);
  for (const width of [360, 390, 430, 1024, 1440, 1920, 2048]) await checkProjects(browser, width);

  const reduced = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  attachNetwork(reduced);
  await reduced.goto(base, { waitUntil: "networkidle" });
  expect(await reduced.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  expect(await reduced.locator(".reveal").first().evaluate(e => getComputedStyle(e).opacity)).toBe("1");
  await reduced.close();

  const nojs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await nojs.goto(base, { waitUntil: "networkidle" });
  await expect(nojs.locator(".editorial-grid .project-card")).toHaveCount(8);
  await expect(nojs.locator(".price-list .price-item")).toHaveCount(5);
  await expect(nojs.locator(".hero-offer")).toContainText("−50%");
  await expect(nojs.locator(".pricing-promo")).toContainText("Скидка 50%");
  await expect(nojs.locator(".hero .reveal").first()).toBeVisible();
  await expect(nojs.locator("#directions .reveal").first()).toBeVisible();
  await expect(nojs.locator("#projects .project-card").first()).toBeVisible();
  await expect(nojs.locator("#about .reveal").first()).toBeVisible();
  await expect(nojs.locator("#contact .reveal").first()).toBeVisible();
  expect(await nojs.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await nojs.screenshot({ path: outDir + "/home-390-nojs.png", fullPage: true });
  await nojs.close();

  expect(errors).toEqual([]);
  expect(failed).toEqual([]);

  const report = {
    passed: true,
    branch: "feat/request-architecture-v4",
    checkedWidths: widths,
    pages: ["home", "projects"],
    checks,
    errors,
    failed,
    reducedMotion: true,
    noJavaScript: true
  };
  fs.writeFileSync(outDir + "/report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
