const {chromium}=require('@playwright/test');
const fs=require('fs'),assert=require('node:assert/strict');
const base=process.env.QA_URL||'http://127.0.0.1:4193/evsavelev-web/';
const output=base.startsWith('https')?'qa/hero-v3-production':'qa/hero-v3-local';
fs.mkdirSync(output,{recursive:true});
const report={base,checks:[],errors:[]};
const check=(name,value)=>{assert.ok(value,name);report.checks.push(name)};
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
for(const [width,height] of [[360,800],[390,844],[430,932],[768,1024],[1024,900],[1440,900]]){
const p=await browser.newPage({viewport:{width,height},isMobile:width<768,hasTouch:width<768});p.setDefaultTimeout(15000);
p.on('pageerror',e=>report.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
await p.addInitScript(()=>{window.heroShifts=[];new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.heroShifts.push(e.value)}).observe({type:'layout-shift',buffered:true})});
check(`${width}: HTTP 200`,(await p.goto(base)).status()===200);
const v=p.locator('#hero-video');
await v.scrollIntoViewIfNeeded();await p.waitForFunction(()=>{const v=document.querySelector('#hero-video');return !v.paused&&v.currentTime>.2});
check(`${width}: media attributes`,await v.evaluate(v=>v.autoplay&&v.muted&&v.loop&&v.playsInline&&!v.controls&&v.videoWidth===1280&&v.videoHeight===720));
check(`${width}: width / ratio / no overflow`,await v.evaluate(v=>{const r=v.getBoundingClientRect();return document.documentElement.scrollWidth===innerWidth&&r.left>=0&&r.right<=innerWidth&&Math.abs(r.width/r.height-16/9)<.01}));
check(`${width}: poster available`,await p.evaluate(async()=>{const i=new Image();i.src=document.querySelector('video').poster;await i.decode();return i.naturalWidth>0}));
report.checks.push(`${width}: total initial CLS ${await p.evaluate(()=>window.heroShifts.reduce((a,b)=>a+b,0))}`);
await p.screenshot({path:`${output}/video-${width}.png`});
await p.locator('[data-hero-video-toggle]').click();check(`${width}: Pause`,await v.evaluate(v=>v.paused));
await p.locator('#contact').scrollIntoViewIfNeeded();await p.waitForTimeout(250);await v.scrollIntoViewIfNeeded();await p.waitForTimeout(250);
check(`${width}: manual Pause survives scroll`,await v.evaluate(v=>v.paused));
await p.locator('[data-hero-video-toggle]').click();await p.waitForFunction(()=>!document.querySelector('video').paused);
await p.locator('#contact').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('video').paused);
check(`${width}: offscreen pause`,true);await v.scrollIntoViewIfNeeded();await p.waitForFunction(()=>!document.querySelector('video').paused);check(`${width}: return resumes`,true);
await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.waitForFunction(()=>scrollY===0);await p.waitForTimeout(100);await p.screenshot({path:`${output}/hero-${width}.png`});
await p.close();
}
const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});p.setDefaultTimeout(15000);let mediaRequests=0;p.on('request',r=>{if(r.url().endsWith('.mp4'))mediaRequests++});await p.goto(base);await p.locator('video').scrollIntoViewIfNeeded();await p.waitForTimeout(500);
check('reduced motion: poster only, no MP4 request',mediaRequests===0&&await p.locator('video').evaluate(v=>v.paused&&!v.currentSrc));
await p.screenshot({path:`${output}/reduced-motion.png`});await p.locator('[data-hero-video-toggle]').click();await p.waitForFunction(()=>!document.querySelector('video').paused&&document.querySelector('video').currentTime>.1);check('reduced motion: manual Play',true);
await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(100);await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>document.querySelector('video').paused);check('live reduced-motion change pauses',true);await p.close();
const q=await browser.newPage();await q.route('**/*.mp4',r=>r.abort());await q.goto(base);await q.locator('video').scrollIntoViewIfNeeded();await q.waitForTimeout(500);check('failed MP4: poster and CTA remain',await q.locator('video').evaluate(v=>!!v.poster)&&await q.locator('.hero-actions').count()===1);await q.close();
check('no console errors',report.errors.length===0);
console.log(JSON.stringify(report,null,2));
}finally{fs.writeFileSync(`${output}/report.json`,JSON.stringify(report,null,2));await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
