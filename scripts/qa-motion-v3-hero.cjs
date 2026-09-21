const {chromium}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.QA_URL||'http://127.0.0.1:4203/evsavelev-web/motion-v3/index.html';
const dir=path.resolve(`qa/motion-v3/${base.startsWith('https')?'production':'local'}/hero-timeline`);
fs.mkdirSync(dir,{recursive:true});
const checkpoints=[0,250,300,450,600,699,700,701,900,1200,1400,1600];
async function measure(p){return p.locator('.hero-canvas').evaluate(canvas=>{
 const el=canvas.querySelector('.site-object'),c=canvas.getBoundingClientRect(),r=el.getBoundingClientRect(),s=getComputedStyle(el);
 return {x:r.x,y:r.y,width:r.width,height:r.height,cx:r.x+r.width/2,cy:r.y+r.height/2,canvasCx:c.x+c.width/2,canvasCy:c.y+c.height/2,transform:s.transform,opacity:+s.opacity,stage:canvas.dataset.stage};
});}
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const report={base,viewports:[],realTime:[]};try{
 for(const width of [360,390,430,768,1024,1440,1920]){
  const p=await browser.newPage({viewport:{width,height:1400}});
  await p.clock.install();await p.clock.pauseAt(new Date());
  // Retain the actual browser animations for deterministic intermediate frames.
  // The implementation and keyframes are not replaced by the test.
  await p.addInitScript(()=>{window.heroAnimations=[];const animate=Element.prototype.animate;Element.prototype.animate=function(...args){const animation=animate.apply(this,args);if(this.closest('.hero-canvas'))window.heroAnimations.push(animation);return animation;};});
  await p.goto(base,{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);
  await p.waitForFunction(()=>window.heroAnimations.length===7,{},{polling:100});
  let previous=0;const samples=[];
  for(const time of checkpoints){
   if(time>previous)await p.clock.runFor(time-previous);
   await p.evaluate(t=>window.heroAnimations.forEach(a=>{a.pause();a.currentTime=t;}),time);
   const sample={time,...await measure(p)};samples.push(sample);
   assert.ok(Math.abs(sample.cx-sample.canvasCx)<.6,`horizontal center ${width}/${time}`);
   assert.ok(Math.abs(sample.cy-sample.canvasCy)<.6,`vertical center ${width}/${time}`);
   assert.ok(await p.locator('h1').isVisible());assert.ok(await p.locator('.hero-actions a').isVisible());
   if([390,1440].includes(width))await p.screenshot({path:path.join(dir,`${width}-${String(time).padStart(4,'0')}ms.png`)});
   previous=time;
  }
  const before=samples.find(s=>s.time===699),after=samples.find(s=>s.time===701);
  assert.ok(Math.abs(before.x-after.x)<.1&&Math.abs(before.y-after.y)<.1,'no boundary jump at animation completion');
  const finished=await measure(p);await p.evaluate(()=>window.heroAnimations.forEach(a=>a.cancel()));const released=await measure(p);
  for(const key of ['x','y','width','height'])assert.ok(Math.abs(finished[key]-released[key])<.1,`no geometry change after animation release: ${key}`);
  assert.equal(released.transform,'none');
  await p.emulateMedia({reducedMotion:'reduce'});await p.clock.runFor(50);const reduced=await measure(p);assert.equal(reduced.transform,'none');
  report.viewports.push({width,samples,completionJumpPx:Math.max(Math.abs(before.x-after.x),Math.abs(before.y-after.y)),releasedTransform:released.transform});await p.close();
 }
 // Also observe the uninterrupted animation in real time, with native rAF.
 for(const width of [390,1440]){
  const p=await browser.newPage({viewport:{width,height:1400}});
  await p.addInitScript(()=>{window.heroFrames=[];let start;function frame(t){const c=document.querySelector('.hero-canvas'),el=c?.querySelector('.site-object');if(el){start??=t;const r=el.getBoundingClientRect(),b=c.getBoundingClientRect();window.heroFrames.push({t:t-start,dx:r.x+r.width/2-b.x-b.width/2,dy:r.y+r.height/2-b.y-b.height/2});if(t-start>=1700){window.heroFramesDone=true;return;}}requestAnimationFrame(frame);}requestAnimationFrame(frame);});
  await p.goto(base);await p.waitForFunction(()=>window.heroFramesDone);const frames=await p.evaluate(()=>window.heroFrames);
  const maxCenterDrift=Math.max(...frames.map(f=>Math.max(Math.abs(f.dx),Math.abs(f.dy))));assert.ok(maxCenterDrift<.6,`real-time center drift ${width}: ${maxCenterDrift}`);
  report.realTime.push({width,frames:frames.length,maxCenterDrift});await p.close();
 }
 fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({viewports:report.viewports.map(v=>({width:v.width,completionJumpPx:v.completionJumpPx})),realTime:report.realTime},null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
