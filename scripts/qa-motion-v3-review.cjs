const {chromium}=require('@playwright/test');
const fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.QA_URL||'http://127.0.0.1:4203/evsavelev-web/motion-v3/index.html';
const dir=`qa/motion-v3/${base.startsWith('https')?'production':'local'}`;
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const p=await browser.newPage({viewport:{width:1440,height:1400}});await p.goto(base);await p.waitForTimeout(1600);
 await p.screenshot({path:`${dir}/hero-final-full.png`});
 await p.locator('#services').evaluate(e=>e.scrollIntoView());await p.locator('.service summary').nth(1).focus();await p.locator('.service[open] img').evaluate(i=>i.decode());await p.screenshot({path:`${dir}/services-active-full.png`});
 await p.locator('#responsive').evaluate(e=>e.scrollIntoView());for(const size of ['desktop','tablet','mobile']){await p.locator(`[data-size="${size}"]`).click();await p.waitForTimeout(300);assert.equal(await p.locator(`[data-size="${size}"]`).getAttribute('aria-pressed'),'true');await p.screenshot({path:`${dir}/responsive-${size}-full.png`});}
 await p.setViewportSize({width:1440,height:900});
 await p.locator('#process').scrollIntoViewIfNeeded();const timing=await p.evaluate(()=>new Promise(resolve=>{const frames=[];let last=performance.now();function tick(now){frames.push(now-last);last=now;scrollBy(0,10);if(frames.length<120)requestAnimationFrame(tick);else{frames.shift();frames.sort((a,b)=>a-b);resolve({medianFrameMs:frames[Math.floor(frames.length*.5)],p95FrameMs:frames[Math.floor(frames.length*.95)],framesOver50ms:frames.filter(x=>x>50).length});}}requestAnimationFrame(tick);}));
 await p.emulateMedia({reducedMotion:'reduce'});assert.ok(await p.locator('.process-stage').isHidden());assert.equal(await p.locator('.hero-canvas').getAttribute('data-stage'),'6');
 await p.emulateMedia({reducedMotion:'no-preference'});await p.locator('.process-stage').waitFor({state:'visible'});
 // Capture existing versions only for comparison; never interact with their forms.
 const root=new URL('../',base.endsWith('/')?base:base.replace(/index\.html$/,''));
 for(const [name,url] of [['main',root.href],['stitch',new URL('stitch-v2/',root).href]]){const localUrl=url.startsWith('http://127.')?`${url}index.html`:url;await p.goto(localUrl);await p.waitForTimeout(600);await p.screenshot({path:`${dir}/comparison-${name}-desktop.png`});await p.setViewportSize({width:390,height:844});await p.screenshot({path:`${dir}/comparison-${name}-mobile.png`});await p.setViewportSize({width:1440,height:900});}
 fs.writeFileSync(`${dir}/review.json`,JSON.stringify({timing,liveReducedMotionToggle:true},null,2));console.log(JSON.stringify({timing,liveReducedMotionToggle:true}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
