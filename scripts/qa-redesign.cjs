const { chromium, expect } = require("@playwright/test");
const fs = require("node:fs");

const base = process.env.QA_URL || "http://127.0.0.1:4194/evsavelev-web/";
const outDir = "qa/request-v4";
fs.mkdirSync(outDir, { recursive: true });

const widths = [360, 390, 430, 768, 1024, 1440];
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

async function checkHome(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  attachNetwork(page);
  await page.goto(base, { waitUntil: "networkidle" });
  await settle(page);

  const layout = await layoutState(page);
  expect(layout.scrollWidth).toBeLessThanOrEqual(width);
  expect(layout.brokenImages).toEqual([]);
  expect(layout.missingAnchors).toEqual([]);

  await expect(page.locator("h1")).toContainText("Создаю сайты");
  await expect(page.locator(".editorial-grid .project-card")).toHaveCount(8);
  await expect(page.locator(".price-list .price-item")).toHaveCount(5);
  await expect(page.locator("#request-dialog")).toHaveCount(1);

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

  await page.screenshot({ path: outDir + "/home-" + width + ".png", fullPage: true });
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

  await page.screenshot({ path: outDir + "/projects-" + width + ".png", fullPage: true });
  checks.push({ page: "projects", width, layout });
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const width of widths) await checkHome(browser, width);
  for (const width of [360, 390, 430, 1024, 1440]) await checkProjects(browser, width);

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
