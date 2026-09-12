const {chromium}=require('@playwright/test');
const fs=require('node:fs'),assert=require('node:assert/strict'),cp=require('node:child_process');
const base=process.env.QA_URL||'http://127.0.0.1:4196/evsavelev-web/';
const dir=`qa/digital-build-v2/${base.startsWith('https')?'production':'local'}`;fs.mkdirSync(dir,{recursive:true});
const checks=[];
(async()=>{const browser=await chromium.launch({channel:'chrome'});try{
for(const [width,height] of [[360,800],[390,844],[430,932],[768,1024],[1024,900],[1440,900]]){
 const p=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base);await p.evaluate(()=>document.fonts.ready);
 assert.equal(await p.locator('h1').count(),1);assert.deepEqual(await p.locator('h1>span').allTextContents(),['Создаю сайты,','которые помогают','бизнесу выглядеть','убедительно.']);
 const boxes=await Promise.all(['.site-header','.hero-media','h1','.hero-copy','.hero-actions','.hero-direct'].map(s=>p.locator(s).boundingBox()));for(let i=1;i<boxes.length;i++)assert.ok(boxes[i].y>=boxes[i-1].y+boxes[i-1].height-1,'hero order');
 assert.ok(await p.locator('h1>span').evaluateAll(spans=>spans.every(s=>s.getBoundingClientRect().height<parseFloat(getComputedStyle(s).fontSize)*1.2)),'four unwrapped lines');
 assert.equal(await p.locator('link[rel=canonical]').getAttribute('href'),'https://evsavelev.github.io/evsavelev-web/');assert.equal(JSON.parse(await p.locator('script[type="application/ld+json"]').textContent()).telephone,'+79088990088');
 await p.screenshot({path:`${dir}/hero-${width}.png`});await p.locator('.hero-offer').screenshot({path:`${dir}/offer-${width}.png`});
 const rows=p.locator('.tariff');assert.equal(await rows.count(),5);
 for(let i=0;i<5;i++){const row=rows.nth(i);await row.locator('summary').click();assert.equal(await p.locator('.tariff[open]').count(),1);assert.equal(await row.locator('.tariff-price').innerText(),require('../data/services.json')[i+1].price);assert.equal(await row.locator('dd').count(),3);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth===innerWidth));}
 await rows.last().locator('summary').focus();await p.keyboard.press('Space');assert.equal(await p.locator('.tariff[open]').count(),0);
 for(const [name,sel] of [['demo','.demo-teaser'],['tariffs','#services'],['approach','.approach'],['contact','#contact']]){await p.locator(sel).screenshot({path:`${dir}/${name}-${width}.png`});}
 await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const violations=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});assert.deepEqual(violations,[],`accessibility ${width}`);
 assert.deepEqual(errors,[]);checks.push(`${width}: hierarchy, screenshots, all tariffs, keyboard, SEO, accessibility, no overflow`);await p.close();
}
const p=await browser.newPage({viewport:{width:390,height:844}});let release;const gate=new Promise(r=>release=r);await p.route('**/*.mp4',async r=>{await gate;await r.continue()});await p.goto(base);await p.evaluate(()=>document.fonts.ready);const before=await p.locator('.hero-media').boundingBox();assert.ok(await p.locator('h1').isVisible());assert.ok(await p.locator('.hero-actions').isVisible());await p.evaluate(()=>{window.shifts=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.shifts.push(e.value)})).observe({type:'layout-shift'})});release();await p.waitForFunction(()=>document.querySelector('video').currentTime>.1);assert.deepEqual(await p.locator('.hero-media').boundingBox(),before);assert.equal(await p.evaluate(()=>window.shifts.reduce((a,b)=>a+b,0)),0);await p.locator('video').evaluate(v=>v.currentTime=v.duration-.15);await p.waitForFunction(()=>document.querySelector('video').currentTime<2);checks.push('Delayed MP4: text/CTA ready, zero media CLS, loop observed');await p.close();
const old=cp.execFileSync('git',['show','440e3cf:index.html'],{encoding:'utf8'});const current=fs.readFileSync('index.html','utf8');const rest=s=>s.slice(s.indexOf('    <section class="demo-teaser')).replace(/\r\n/g,'\n');assert.equal(rest(current),rest(old));checks.push('All markup after hero unchanged; original content and SEO preserved');
console.log(JSON.stringify(checks,null,2));fs.writeFileSync(`${dir}/report.json`,JSON.stringify({base,checks},null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
