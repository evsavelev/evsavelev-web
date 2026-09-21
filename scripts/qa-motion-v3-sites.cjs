const {chromium}=require('@playwright/test');
const fs=require('node:fs'),assert=require('node:assert/strict');
const root=process.env.SITES_URL||'http://127.0.0.1:4203/evsavelev-web/';
const production=root.startsWith('https:');
const dir=`qa/motion-v3/${production?'production':'local'}`;
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];try{
 for(const site of ['main','stitch-v2'])for(const width of [390,1440]){
  const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  const url=root+(site==='main'?'':'stitch-v2/')+(production?'':'index.html');
  assert.equal((await p.goto(url,{waitUntil:'networkidle'})).status(),200);assert.ok(await p.locator('h1').isVisible());
  assert.equal(await p.locator('.project').count(),10);
  for(const href of ['tel:+79088990088','https://wa.me/79088990088','https://t.me/+79088990088?profile','mailto:evsavelev.region@gmail.com'])assert.ok(await p.locator(`a[href="${href}"]`).count()>0);
  if(site==='main'){
   if(width===390){await p.locator('.menu-toggle').click();assert.ok(await p.locator('#menu-dialog').isVisible());await p.keyboard.press('Escape');}
   await p.locator('.hero [data-service]').first().click();assert.ok(await p.locator('#request-dialog').isVisible());
   // Validation is local. Do not open external messengers or send anything.
   await p.locator('#request-form [data-channel="whatsapp"]').click();assert.equal(await p.locator('#request-form [name="phone"]').getAttribute('aria-invalid'),'true');
   await p.keyboard.press('Escape');assert.ok(await p.locator('#request-dialog').isHidden());
   await p.locator('.hero a.button[href="#work"]').click();assert.ok(await p.locator('#work').isVisible());
  }else{
   if(width===390){await p.locator('.menu-toggle').click();assert.equal(await p.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await p.keyboard.press('Escape');}
   await p.locator('.more-projects').click();assert.equal(await p.locator('.project:visible').count(),10);
   await p.locator('#request [name="name"]').fill('QA');await p.locator('#request [name="contact"]').fill('+7 999 123-45-67');await p.locator('#request .prepare-button').click();assert.ok(await p.locator('#prepared').isVisible());assert.ok((await p.locator('#message-text').inputValue()).includes('QA'));
  }
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);results.push({site,width,http:200,contacts:true,navigation:true,form:true,errors});await p.close();
 }
 fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(`${dir}/existing-sites.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
