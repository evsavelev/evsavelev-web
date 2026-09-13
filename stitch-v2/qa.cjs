const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
const base = process.env.QA_URL || 'http://127.0.0.1:4193/evsavelev-web/stitch-v2/';
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 const page = await browser.newPage();
 const errors=[],badAssets=[],results=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)badAssets.push({url:r.url(),status:r.status()})});
 for(const width of [360,390,430,768,1024,1440]){
  await page.setViewportSize({width,height:900});await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.getClientRects().length).map(i=>{i.loading='eager';return i.decode()}))});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  await expect(page.locator('.project:visible')).toHaveCount(4);
  await page.locator('[data-filter="business"]').click();await expect(page.locator('.project:visible')).toHaveCount(4);await expect(page.locator('.more-projects')).not.toBeVisible();
  await page.locator('[data-filter="services"]').click();await expect(page.locator('.project:visible')).toHaveCount(4);
  await page.locator('[data-filter="interior"]').click();await expect(page.locator('.project:visible')).toHaveCount(2);
  await page.locator('[data-filter="all"]').click();await page.locator('.more-projects').click();await expect(page.locator('.project:visible')).toHaveCount(10);
  await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.project img')].map(i=>{i.loading='eager';return i.decode()}))});
  await page.locator('.more-projects').click();await expect(page.locator('.project:visible')).toHaveCount(4);
  if(width<1024){await page.locator('.menu-toggle').click();await expect(page.locator('#mobile-nav')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('.menu-toggle')).toBeFocused();await page.locator('.menu-toggle').click();await page.locator('#mobile-nav a[href="#pricing"]').click();await expect(page.locator('#mobile-nav')).not.toBeVisible()}
  await page.locator('.hero [data-format]').click();await expect(page.locator('#site-format')).toHaveValue('Персональное демо — 0 ₽');
  await page.locator('.prepare-button').click();await expect(page.locator('#name-error')).toHaveText('Укажите ваше имя.');await expect(page.locator('#client-name')).toBeFocused();
  await page.locator('#client-name').fill('Проверка');await page.locator('#client-contact').fill('@test-contact');await page.locator('#client-comment').fill('Тест без отправки <script>alert(1)</script>');await page.locator('.prepare-button').click();
  await expect(page.locator('#prepared')).toBeVisible();await expect(page.locator('#message-text')).toHaveValue(/Тест без отправки <script>/);
  const href=await page.locator('#send-whatsapp').getAttribute('href');expect(href.startsWith('https://wa.me/79088990088?text=')).toBe(true);expect(decodeURIComponent(href)).toContain('Проверка');
  expect(await page.locator('#send-email').getAttribute('href')).toContain('mailto:evsavelev.region@gmail.com?subject=');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  await page.locator('#client-comment').fill('Новая версия');await expect(page.locator('#prepared')).not.toBeVisible();
  results.push({width,overflow:false,filters:true,images:true,form:true});
 }
 await page.goto(base,{waitUntil:'networkidle'});
 for(const card of await page.locator('.price-card').all()){
  const a=card.locator('[data-format]');const value=await a.getAttribute('data-format');await a.click();await expect(page.locator('#site-format')).toHaveValue(value);await expect(page.locator('.prepare-button')).toContainText('Подготовить обращение');
 }
 const selectors=await page.locator('[data-format]').count();
 for(let i=0;i<selectors;i++){const link=page.locator('[data-format]').nth(i);await link.click();await expect(page.locator('#site-format')).toHaveValue(await link.getAttribute('data-format'))}
 await page.locator('#client-name').fill('Тест');await page.locator('#client-contact').fill('test@example.com');await page.locator('.prepare-button').click();
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);await page.locator('#copy-message').click();await expect(page.locator('#form-status')).toContainText('Текст скопирован');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('QA denied')}}}));await page.locator('#copy-message').click();await expect(page.locator('#form-status')).toContainText('вручную');await expect(page.locator('#message-text')).toBeFocused();
 await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement.id)).toBe('send-whatsapp');
 const links=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')));
 const channels=['tel:+79088990088','https://wa.me/79088990088','https://t.me/+79088990088?profile','https://max.ru/u/f9LHodD0cOI3lG2rCNUhXaH2sHDji6eki00A8hQZEJLe7xK2dwy4zaDRH88','mailto:evsavelev.region@gmail.com'];for(const link of channels)expect(links).toContain(link);
 const projects=require('../data/projects.json');for(const p of projects)expect(links).toContain(p.url||`https://evsavelev.github.io/${p.slug}/`);
 expect(await page.locator('meta[name="robots"]').getAttribute('content')).toBe('noindex, nofollow');
 expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe('https://evsavelev.github.io/evsavelev-web/');
 expect(await page.locator('video').count()).toBe(0);
 const source=await page.content();for(const forbidden of ['Nordic Wood','Aura Med','ProLogix','Apex Legal','PageSpeed','SLA','30 минут','Tailwind','fonts.googleapis.com','gstatic.com','googleusercontent.com'])expect(source).not.toContain(forbidden);
 const missing=await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h!=='#'&&!document.querySelector(h)));expect(missing).toEqual([]);
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(base);await expect(nojs.locator('.project:visible')).toHaveCount(10);await expect(nojs.locator('.filters')).not.toBeVisible();await expect(nojs.locator('.hero [data-format]')).toHaveAttribute('href','#request');await expect(nojs.locator('.channel-link')).toHaveCount(4);
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(base);expect(await reduced.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
 expect(errors).toEqual([]);expect(badAssets).toEqual([]);
 const report={base,passed:true,results,errors,badAssets,projectLinks:10,pricingCTAs:5,noJavaScript:true,reducedMotion:true,clipboard:'success and manual fallback verified',messagesSent:0};
 fs.mkdirSync('qa',{recursive:true});fs.writeFileSync('qa/stitch-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
