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
    elements.filter(el => {
      const style = getComputedStyle(el);
      // Production intentionally displays reveal elements without waiting for an animation class.
      // Treat only truly transparent content as a regression.
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) < 0.98;
    }).map(el => {
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

  await expect(page.locator("h1")).toHaveText("Создаю сайты для бизнеса");
  await expect(page.locator(".site-header .brand-logo")).toBeVisible();
  await expect(page.locator(".hero-preview")).toHaveAttribute("href", "https://evsavelev.github.io/tehnologiya-nizhnevartovsk/");
  if (width <= 430) {
    const title = await page.locator(".hero-title").boundingBox();
    const actions = await page.locator(".hero-actions").boundingBox();
    const preview = await page.locator(".hero-preview").boundingBox();
    expect(title.height).toBeLessThan(120);
    expect(actions.y + actions.height).toBeLessThan(460);
    expect(preview.y).toBeLessThan(540);
  }
  await expect(page.locator(".editorial-grid .project-card")).toHaveCount(8);
  const reviews = page.locator("#reviews");
  await expect(reviews).toBeVisible();
  await expect(reviews).toContainText("Биток-консалтинг");
  await expect(reviews).toContainText("Андрей Савельев");
  const reviewsUrl = "https://2gis.ru/nizhnevartovsk/firm/70000001118870070/tab/reviews";
  await expect(reviews.getByRole("link", { name: /Читать отзывы на 2ГИС/ })).toHaveAttribute("href", reviewsUrl);
  await expect(reviews.getByRole("link", { name: /Оставить отзыв/ })).toHaveAttribute("href", reviewsUrl);
  const sectionOrder = await page.evaluate(() => ({
    projects: document.querySelector("#projects")?.getBoundingClientRect().top,
    reviews: document.querySelector("#reviews")?.getBoundingClientRect().top,
    process: document.querySelector("#process")?.getBoundingClientRect().top
  }));
  expect(sectionOrder.projects).toBeLessThan(sectionOrder.reviews);
  expect(sectionOrder.reviews).toBeLessThan(sectionOrder.process);

  const catalog = page.locator("#prices");
  await expect(catalog.locator(".price-item")).toHaveCount(12);
  await expect(catalog.locator(".price-group")).toHaveCount(6);
  await expect(page.locator(".hero-prices")).toHaveAttribute("href", "#prices");
  await expect(page.locator("#service-business-card .price-value")).toHaveText("от 17 500 ₽");
  await expect(page.locator("#service-landing .price-value")).toHaveText("от 25 000 ₽");

  if ([360, 390, 430, 768, 1440].includes(width)) {
    const cards = catalog.locator(".price-item");
    for (const card of await cards.all()) {
      const title = await card.locator("h4").innerText();
      const price = await card.locator(".price-value").innerText();
      const action = card.locator("[data-service]");
      await action.click();
      await expect(page.locator("#request-service")).toHaveValue(await action.getAttribute("data-service"));
      await expect(page.locator(".request-selection")).toHaveText(`${title} — ${price}`);
      await page.keyboard.press("Escape");
      await expect(page.locator("body")).not.toHaveClass(/dialog-open/);
      await expect(action).toBeFocused();
    }
    await expect(page.locator("#request-service optgroup option")).toHaveCount(12);
    const details = cards.first().locator("summary");
    await details.press("Enter");
    await expect(cards.first().locator("details p")).toBeVisible();
    await details.press("Enter");
    await expect(cards.first().locator("details p")).not.toBeVisible();
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
  await expect(page.locator("#request-service")).toHaveValue("demo");
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
  const browser = await chromium.launch({ headless: true, executablePath: process.env.QA_CHROMIUM });

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
  await expect(nojs.locator(".price-list .price-item")).toHaveCount(12);
  await nojs.locator("#service-business-card summary").click();
  await expect(nojs.locator("#service-business-card details p")).toBeVisible();
  await nojs.locator("#service-business-card [data-service]").click();
  await expect(nojs).toHaveURL(/#contact$/);
  await expect(nojs.locator(".hero-title")).toBeVisible();
  await expect(nojs.locator(".hero-preview img")).toBeVisible();
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
