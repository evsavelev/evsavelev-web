const {chromium}=require('@playwright/test');
const fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.QA_URL||'http://127.0.0.1:4190/evsavelev-web/';
const label=base.startsWith('https:')?'public':'local';
const dir=`qa/${label}`;fs.mkdirSync(dir,{recursive:true});
const report={date:new Date().toISOString(),base,widths:[],checks:[],errors:[],external:[]};
const check=(name,condition)=>{assert.ok(condition,name);report.checks.push(name)};
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  for(const width of [360,390,430,768,1024,1440]){
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768,deviceScaleFactor:1,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
   const page=await context.newPage();
   page.on('pageerror',e=>report.errors.push(`${width}: ${e.message}`));page.on('console',m=>{if(m.type()==='error')report.errors.push(`${width}: ${m.text()}`)});
   const response=await page.goto(base,{waitUntil:'networkidle'});check(`${width}: HTTP 200`,response.status()===200);
   await page.evaluate(()=>document.fonts.ready);
   check(`${width}: one H1 and eight projects`,await page.locator('h1').count()===1&&await page.locator('.project').count()===8);
   await page.screenshot({path:`${dir}/hero-${width}.png`});
   for(const image of await page.locator('.project img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(img=>img.decode());}
   await page.locator('.about-portrait img').scrollIntoViewIfNeeded();await page.locator('.about-portrait img').evaluate(i=>i.decode());
   const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth||!i.alt||!i.width||!i.height).map(i=>i.src));check(`${width}: eight previews and portrait loaded with alt/dimensions`,broken.length===0);
   check(`${width}: portrait lazy and full frame`,await page.locator('.about-portrait img').evaluate(i=>i.loading==='lazy'&&getComputedStyle(i).objectFit==='contain'&&i.alt==='Евгений Савельев — создание сайтов для бизнеса'));
   await page.locator('.about-portrait').screenshot({path:`${dir}/portrait-${width}.png`});
   await page.locator('.about-cta').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/about-${width}.png`});await page.locator('.about-cta').click();check(`${width}: personal CTA reaches contacts`,page.url().endsWith('#contact'));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);check(`${width}: no horizontal overflow`,!overflow);
   const anchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(l=>l.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1))));check(`${width}: internal anchors resolve`,anchors.length===0);
   await page.locator('#contact').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/contact-${width}.png`});
   const copy=page.locator('#contact [data-copy]');await copy.click();await page.waitForFunction(()=>document.querySelector('#contact .copy-status').textContent.includes('Номер скопирован'));check(`${width}: MAX clipboard`,await page.evaluate(()=>navigator.clipboard.readText())==='+79088990088');
   if(width<768){
    await page.locator('[data-contact-open]').tap();check(`${width}: contact dialog and bar hidden`,await page.locator('#contact-dialog').isVisible()&&await page.locator('.mobile-bar').evaluate(e=>getComputedStyle(e).visibility)==='hidden');
    await page.screenshot({path:`${dir}/dialog-${width}.png`});
    for(let i=0;i<10;i++){await page.keyboard.press('Tab');check(`${width}: focus trapped ${i}`,await page.evaluate(()=>document.querySelector('#contact-dialog').contains(document.activeElement)));}
    await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement===document.querySelector('[data-contact-open]'));check(`${width}: Escape and focus restored`,await page.locator('[data-contact-open]').evaluate(e=>e===document.activeElement));
    await page.evaluate(()=>scrollTo(0,0));await page.locator('.menu-toggle').tap();check(`${width}: mobile menu`,await page.locator('#menu-dialog').isVisible());await page.locator('#menu-dialog a[href="#work"]').tap();check(`${width}: menu closes on anchor`,!await page.locator('#menu-dialog').isVisible());
    await page.locator('[data-contact-open]').tap();await page.locator('#contact-dialog [data-close]').tap();check(`${width}: close button`,!await page.locator('#contact-dialog').isVisible());
   }
   const badTargets=await page.locator('a,button').evaluateAll(nodes=>nodes.filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').filter(e=>{const r=e.getBoundingClientRect();return r.width<24||r.height<44}).map(e=>({text:e.textContent.trim(),height:e.getBoundingClientRect().height})));check(`${width}: visible targets min 44px high`,badTargets.length===0);
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${dir}/full-${width}.png`,fullPage:true});
   report.widths.push({width,status:response.status(),height:await page.evaluate(()=>document.body.scrollHeight),images:9,portfolioImages:8,overflow});await context.close();console.log('Passed viewport',width);
  }
  const page=await browser.newPage();await page.goto(base);
  const metadata=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]').content,canonical:document.querySelector('link[rel="canonical"]').href,og:document.querySelector('meta[property="og:image"]').content,schema:JSON.parse(document.querySelector('[type="application/ld+json"]').textContent),lang:document.documentElement.lang}));report.metadata=metadata;
  check('SEO canonical / confirmed email / Person',metadata.canonical==='https://evsavelev.github.io/evsavelev-web/'&&metadata.schema.email==='evsavelev.region@gmail.com'&&metadata.schema['@type']==='Person');
  const mail=await page.locator('a[href^="mailto:"]').evaluateAll(a=>a.map(x=>x.getAttribute('href')));check('All email links confirmed',mail.every(x=>x==='mailto:evsavelev.region@gmail.com'));
  check('No submission form or fake sent message',await page.locator('form').count()===0&&!/заявка отправлена|успешно отправлен/i.test(await page.locator('body').innerText()));
  for(const file of ['sitemap.xml','robots.txt','assets/favicon.svg','assets/og.jpg']){const r=await page.request.get(base+file);check(`${file}: 200`,r.status()===200);if(file==='sitemap.xml')check('Sitemap canonical', (await r.text()).includes(metadata.canonical));}
  const response404=await page.goto(base+'not-a-real-page-qa/');check('Unknown URL returns actual 404',response404.status()===404);check('404 noindex and home link',await page.locator('meta[name="robots"]').getAttribute('content')==='noindex'&&await page.locator('a').getAttribute('href')==='/evsavelev-web/');await page.locator('a').click();check('404 returns to site',new URL(page.url()).pathname==='/evsavelev-web/');
  const external=await page.locator('.project-link').evaluateAll(a=>a.map(x=>x.href));for(const url of external){const r=await page.request.get(url);check('Portfolio public 200 '+url,r.status()===200);report.external.push({url,status:r.status()});}
  const popupPromise=page.waitForEvent('popup');await page.locator('.project-link').first().click();const popup=await popupPromise;await popup.waitForURL(external[0],{waitUntil:'domcontentloaded'});check('Project opens new tab',popup.url()===external[0]);await popup.close();await page.locator('.hero-actions a[href="#contact"]').click();check('Work → return → contact path',page.url().endsWith('#contact'));
  await page.close();
  const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(base);check('No JS: all content and mobile nav accessible',await nojs.locator('.project').count()===8&&await nojs.locator('.desktop-nav').isVisible());await nojs.locator('[data-contact-open]').click();check('No JS: sticky anchor works',nojs.url().endsWith('#contact'));await nojs.screenshot({path:`${dir}/no-js.png`});await nojs.close();
  const denied=await browser.newPage({viewport:{width:390,height:844}});await denied.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))}}));await denied.goto(base);await denied.locator('#contact [data-copy]').click();await denied.waitForFunction(()=>document.querySelector('#contact .copy-status').textContent.includes('Не удалось'));check('Clipboard denied: truthful manual fallback',true);await denied.close();
  const motion=await browser.newPage({viewport:{width:390,height:844}});await motion.goto(base);await motion.locator('#services').scrollIntoViewIfNeeded();await motion.waitForTimeout(600);check('Normal motion reveals content',await motion.locator('#services .section-heading').evaluate(e=>getComputedStyle(e).opacity)==='1');await motion.emulateMedia({reducedMotion:'reduce'});check('Reduced-motion switch exposes all content',await motion.locator('.reveal').evaluateAll(a=>a.every(e=>getComputedStyle(e).opacity==='1')));await motion.close();
  check('Zero unexpected console/page errors',report.errors.length===0);
  report.result='PASS';
 }finally{await browser.close();fs.writeFileSync(`${dir}/report.json`,JSON.stringify(report,null,2));}
 console.log(`PASS ${report.checks.length} checks → ${dir}/report.json`);
})().catch(e=>{report.result='FAIL';report.failure=e.message;fs.writeFileSync(`${dir}/report.json`,JSON.stringify(report,null,2));console.error(e);process.exit(1)});
