const {chromium}=require('@playwright/test');
const fs=require('fs'),assert=require('assert/strict'),cp=require('child_process');
const url=process.env.QA_URL||'http://127.0.0.1:4193/evsavelev-web/';
fs.mkdirSync('qa',{recursive:true});
const tag=url.startsWith('https')?'production':'local';
(async()=>{const b=await chromium.launch({channel:'chrome'});const results=[];try{
for(const width of [360,390,430,1440]){
 const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 assert.equal((await p.goto(url)).status(),200);await p.evaluate(()=>document.fonts.ready);
 assert.equal(await p.locator('.tariff').count(),5);assert.equal(await p.locator('.tariff[open]').count(),0);
 assert.equal(await p.locator('section.prices').count(),0);
 const data=require('../data/services.json').slice(1);
 assert.deepEqual(await p.locator('.tariff-title').allTextContents(),data.map(s=>s.name));
 await p.locator('#services').scrollIntoViewIfNeeded();await p.screenshot({path:`qa/${tag}-${width}-closed.png`});
 for(let i=0;i<5;i++){
  const row=p.locator('.tariff').nth(i);assert.equal(await row.locator('.tariff-price').isVisible(),false);
  assert.ok(!(await row.locator('summary').innerText()).includes('₽'));
  await row.locator('summary').click();assert.equal(await row.locator('.tariff-price').innerText(),data[i].price);
  assert.equal(await row.locator('.tariff-price').isVisible(),true);assert.equal(await p.locator('.tariff[open]').count(),1);
  assert.equal(await row.locator('dd').count(),3);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(i===2){await row.scrollIntoViewIfNeeded();await p.screenshot({path:`qa/${tag}-${width}-open.png`});}
 }
 await p.locator('.tariff[open] a').click();assert.ok(p.url().endsWith('#contact'));assert.equal(await p.locator('dialog[open]').count(),0);
 const summary=p.locator('.tariff summary').first();await summary.focus();await p.keyboard.press('Enter');assert.equal(await p.locator('.tariff').first().getAttribute('open'),'');
 await p.keyboard.press('Space');assert.equal(await p.locator('.tariff').first().getAttribute('open'),null);
 assert.deepEqual(errors,[]);results.push({width,passed:true});await p.close();
}
const context=await b.newContext({javaScriptEnabled:false,viewport:{width:360,height:800}});const p=await context.newPage();await p.goto(url);await p.locator('.tariff summary').first().click();assert.ok(await p.locator('.tariff-price').first().isVisible());assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await context.close();
const before=cp.execFileSync('git',['show','93d0b2f:index.html'],{encoding:'utf8'}),after=fs.readFileSync('index.html','utf8');
const outside=s=>s.replace(/\r\n/g,'\n').replace(/    <section class="services[\s\S]*?(?=    <section class="included)/,'');assert.equal(outside(before),outside(after));
fs.writeFileSync(`qa/${tag}-report.json`,JSON.stringify({url,results,noJS:true,unrelatedMarkupUnchanged:true},null,2));console.log(JSON.stringify({url,results,noJS:true,unrelatedMarkupUnchanged:true}));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});

