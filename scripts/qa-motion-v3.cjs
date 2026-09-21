const {chromium}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process');
const base=process.env.QA_URL||'http://127.0.0.1:4203/evsavelev-web/motion-v3/index.html';
const mode=base.startsWith('https:')?'production':'local';
const dir=path.resolve(`qa/motion-v3/${mode}`);fs.mkdirSync(dir,{recursive:true});
const report={base,date:new Date().toISOString(),viewports:[],checks:[],performance:[]};
const sizes=[[360,800],[390,844],[430,932],[768,1024],[1024,900],[1440,900],[1920,1080]];
async function capture(p,name){await p.screenshot({path:path.join(dir,`${name}.png`)});}
async function anchor(p,id){await p.locator(id).evaluate(el=>el.scrollIntoView({block:'start'}));await p.waitForTimeout(300);}
async function audit(p){
 assert.equal(await p.locator('h1').count(),1);
 assert.equal(await p.locator('meta[name=robots]').getAttribute('content'),'noindex, nofollow');
 assert.equal(await p.locator('link[rel=canonical]').getAttribute('href'),'https://evsavelev.github.io/evsavelev-web/');
 assert.equal(await p.locator('.project').count(),10);
 assert.equal(await p.locator('.project h3').first().innerText(),'Международные расчёты для бизнеса');
 assert.equal(await p.locator('.project h3').nth(1).innerText(),'Bitok Consulting');
 assert.ok((await p.locator('#pricing').innerText()).includes('от 35 000 ₽'));
 assert.deepEqual(await p.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)),[]);
}
async function fullScroll(p){
 const height=await p.evaluate(()=>document.documentElement.scrollHeight),step=await p.evaluate(()=>innerHeight*.7);
 for(let y=0;y<height;y+=step){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(40);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow at ${y}`);}
 await p.waitForTimeout(250);
 assert.deepEqual(await p.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.checkVisibility()&&(!i.complete||!i.naturalWidth)).map(i=>i.src)),[],'broken visible images');
}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 for(const [width,height] of sizes){
  const p=await browser.newPage({viewport:{width,height},isMobile:width<768,hasTouch:width<768});const errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400&&r.url().startsWith(new URL(base).origin))errors.push(`${r.status()} ${r.url()}`);});
  await p.addInitScript(()=>{window.metrics={cls:0,lcp:0,longTasks:[],shifts:[]};let session=0,start=0,last=0;new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput){if(e.startTime-last>1000||e.startTime-start>5000){session=0;start=e.startTime;}session+=e.value;last=e.startTime;window.metrics.cls=Math.max(window.metrics.cls,session);window.metrics.shifts.push({value:e.value,time:e.startTime,sources:e.sources.map(s=>s.node?.className||s.node?.nodeName)});}})).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>window.metrics.lcp=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>window.metrics.longTasks.push(e.duration))).observe({type:'longtask',buffered:true});});
  const response=await p.goto(base,{waitUntil:'networkidle'});assert.equal(response.status(),200);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);await audit(p);await capture(p,`hero-${width}`);
  if(width<768){await p.locator('.menu-toggle').click();assert.equal(await p.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await p.locator('#navigation a[href="#pricing"]').click();assert.equal(await p.locator('.menu-toggle').getAttribute('aria-expanded'),'false');await p.locator('.menu-toggle').click();await p.keyboard.press('Escape');assert.equal(await p.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
  await anchor(p,'#services');await p.locator('.service summary').nth(1).click();await p.waitForTimeout(100);if(!(await p.locator('.service').nth(1).getAttribute('open')!==null))await p.locator('.service summary').nth(1).click();assert.equal(await p.locator('.service[open]').count(),1);assert.ok(await p.locator('.service').nth(1).locator('.service-visual').isVisible());await capture(p,`services-${width}`);
  for(const img of await p.locator('.service[open] img').all())await img.evaluate(i=>i.decode());
  if([390,1440].includes(width))await p.locator('#services').screenshot({path:path.join(dir,`services-${width}.png`)});
  await fullScroll(p);
  for(const [name,id] of [['process','#process'],['portfolio','#project-1'],['responsive','#responsive'],['pricing','#pricing'],['demo','#demo'],['contact','#contact']]){await anchor(p,id);if([390,1440].includes(width))await capture(p,`${name}-${width}`);}
  await p.locator('#request button[type=submit]').click();assert.equal(await p.locator('#phone').getAttribute('aria-invalid'),'true');await p.locator('#phone').fill('+7 999 123-45-67');await p.locator('#comment').fill('Тест QA: сайт для бизнеса & детали');await p.locator('#request button[type=submit]').click();assert.ok(await p.locator('#prepared').isVisible());assert.ok((await p.locator('#form-status').innerText()).includes('Ничего не отправлено'));assert.ok(decodeURIComponent(await p.locator('#send-whatsapp').getAttribute('href')).includes('Тест QA: сайт для бизнеса & детали'));await p.locator('#comment').fill('Исправление');assert.ok(await p.locator('#prepared').isHidden());
  const metrics=await p.evaluate(()=>window.metrics);fs.writeFileSync(path.join(dir,`metrics-${width}.json`),JSON.stringify(metrics,null,2));assert.ok(metrics.cls<=.1,`CLS ${width}: ${metrics.cls}`);report.performance.push({width,...metrics});
  assert.deepEqual(errors,[],`browser errors ${width}`);report.viewports.push({width,height,fullScroll:true,errors,overflow:false,assets:true,form:true});await p.close();
 }
 const p=await browser.newPage({viewport:{width:1440,height:900}});
 await p.goto(base);await p.waitForTimeout(1600);
 // Screenshots use natural scroll positions, never direct mutation of stage state.
 const geometry=await p.locator('.process-layout').evaluate(e=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight}));
 for(const [name,progress,expected] of [['research',.05,0],['structure',.21,1],['wireframe',.38,2],['design',.54,3],['development',.69,4],['mobile',.83,5],['published',.96,6]]){
  await p.evaluate(y=>scrollTo(0,y),geometry.top-130+progress*(geometry.height-900*.85));await p.waitForTimeout(700);assert.equal(await p.locator('.process-canvas').getAttribute('data-stage'),String(expected),name);await capture(p,`process-${name}`);
 }
 await anchor(p,'#responsive');
 const layouts=[];for(const size of ['desktop','tablet','mobile']){await p.locator(`[data-size="${size}"]`).click();await p.waitForTimeout(100);layouts.push(await p.locator('.responsive-canvas').evaluate(el=>({width:el.querySelector('.site-object').offsetWidth,layout:getComputedStyle(el.querySelector('.mini-layout')).display,menu:getComputedStyle(el.querySelector('.mini-menu')).display,imageRatio:getComputedStyle(el.querySelector('.mini-image img')).aspectRatio})));await capture(p,`responsive-${size}`);}
 assert.ok(layouts[0].width>layouts[2].width);assert.equal(layouts[0].layout,'grid');assert.equal(layouts[2].layout,'flex');assert.notEqual(layouts[0].menu,layouts[2].menu);assert.notEqual(layouts[0].imageRatio,layouts[2].imageRatio);report.checks.push({responsiveLayouts:layouts});
 await p.evaluate(()=>scrollTo(0,0));await p.keyboard.press('Tab');
 assert.ok(await p.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle!=='none'),'visible keyboard focus');
 for(let i=0;i<60;i++)await p.keyboard.press('Tab');
 report.checks.push('Keyboard tab traversal: no focus trap');
 await p.close();
 for(const options of [{javaScriptEnabled:false},{reducedMotion:'reduce'}])for(const width of [390,1440]){
  const p=await browser.newPage({viewport:{width,height:900},...options});await p.goto(base);await audit(p);await fullScroll(p);
  assert.ok(await p.locator('h1').isVisible());assert.ok(await p.locator('#contact .channels').isVisible());assert.equal(await p.locator('.process-stage').isVisible(),false);
  if(options.reducedMotion){assert.equal(await p.locator('.hero-canvas').getAttribute('data-stage'),'6');assert.equal(await p.locator('.hero-canvas').evaluate(e=>getComputedStyle(e).transform),'none');}
  await p.evaluate(()=>scrollTo(0,0));await capture(p,`${options.javaScriptEnabled===false?'no-js':'reduced'}-${width}`);await p.close();
 }
 report.checks.push('No-JS and reduced-motion desktop/mobile: all essential content, contacts, compact process');
 // Freeze the clock before navigation to capture the true initial hero with CTA visible.
 const initial=await browser.newPage({viewport:{width:1440,height:900}});await initial.clock.install();await initial.clock.pauseAt(new Date());await initial.goto(base,{waitUntil:'load'});await capture(initial,'hero-initial');assert.ok(await initial.locator('h1').isVisible());assert.ok(await initial.locator('.hero-actions a').isVisible());await initial.close();
 if(mode==='local'){
  const diff=cp.execFileSync('git',['diff','08ffc1d','--diff-filter=M','--name-only'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);assert.deepEqual(diff,['.github/workflows/pages.yml']);
  const baseline=cp.execFileSync('git',['ls-tree','-r','08ffc1d'],{encoding:'utf8'});for(const line of baseline.trim().split(/\r?\n/)){const match=line.match(/^\d+ blob ([a-f0-9]+)\t(.+)$/);if(!match||match[2]==='.github/workflows/pages.yml')continue;const actual=cp.execFileSync('git',['hash-object','--path='+match[2],match[2]],{encoding:'utf8'}).trim();assert.equal(actual,match[1],`baseline changed: ${match[2]}`);}
  report.checks.push('All baseline tracked files byte-equivalent through git clean filters; only additive Pages step changed');
 }
 fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{fs.writeFileSync(path.join(dir,'failure.txt'),e.stack);console.error(e);process.exit(1)});
