const {chromium}=require('@playwright/test'),fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.QA_URL||'http://127.0.0.1:4190/evsavelev-web/';
const dir=`qa/${base.startsWith('https:')?'public':'local'}/mobile-contacts`;fs.mkdirSync(dir,{recursive:true});
const max='https://max.ru/u/f9LHodD0cOI3lG2rCNUhXaH2sHDji6eki00A8hQZEJLe7xK2dwy4zaDRH88';
const expected=['tel:+79088990088','https://wa.me/79088990088','https://t.me/+79088990088?profile',max,'mailto:evsavelev.region@gmail.com'];
const report={date:new Date().toISOString(),base,checks:[],errors:[],screens:[]};const check=(name,value)=>{assert.ok(value,name);report.checks.push(name)};
(async()=>{const browser=await chromium.launch({channel:'chrome'});try{
for(const [width,height] of [[360,800],[390,844],[430,932],[768,1024],[1024,900],[1440,900]]){
 const context=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768});const p=await context.newPage();p.on('pageerror',e=>report.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
 check(`${width}: HTTP 200`,(await p.goto(base,{waitUntil:'networkidle'})).status()===200);
 check(`${width}: no legacy fixed bar or copying UI`,await p.locator('.mobile-bar,[data-copy]').count()===0&&!/Найдите меня в MAX|Копировать номер/.test(await p.locator('body').innerText()));
 await p.screenshot({path:`${dir}/hero-${width}.png`});
 let scrollSteps=0;for(let y=0;y<await p.evaluate(()=>document.body.scrollHeight);y+=Math.floor(height*.7)){
  await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await p.waitForTimeout(100);
  const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,overlays:[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return ['fixed','sticky'].includes(s.position)&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}).map(e=>e.className)}));
  assert.ok(!state.overflow,`${width}: overflow at ${y}`);assert.deepEqual(state.overlays,[],`${width}: overlay at ${y}`);scrollSteps++;
 }
 check(`${width}: full scroll without overlays or overflow (${scrollSteps} positions)`,true);
 for(const img of await p.locator('main img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
 check(`${width}: 8 projects + portrait`,await p.locator('.project').count()===8&&await p.locator('main img').count()===9);
 check(`${width}: five process steps`,await p.locator('.steps li').count()===5);
 for(const [name,selector] of [['principles','.principles'],['process','#process'],['about','#about'],['contacts','#contact'],['footer','.site-footer']]){await p.locator(selector).scrollIntoViewIfNeeded();await p.waitForTimeout(500);await p.screenshot({path:`${dir}/${name}-${width}.png`});}
 check(`${width}: footer padding normal`,await p.locator('.site-footer').evaluate(e=>parseFloat(getComputedStyle(e).paddingBottom)<=40));
 check(`${width}: MAX alongside WhatsApp and Telegram`,await p.locator('.messengers a').evaluateAll(a=>a.map(e=>e.textContent.trim().split(' ')[0]).join(','))==='WhatsApp,Telegram,MAX');
 const links=p.locator(`a[href="${max}"]`);check(`${width}: two safe direct MAX links`,await links.count()===2&&await links.evaluateAll(a=>a.every(e=>e.target==='_blank'&&e.rel.includes('noopener')&&e.rel.includes('noreferrer'))));
 // Real clicks capture the URI; no calls, email or messages are sent.
 await p.evaluate(()=>{window.clickedContacts=[];document.addEventListener('click',e=>{const a=e.target.closest('a');if(a&&/^(tel:|mailto:|https:\/\/(wa.me|t.me|max.ru))/.test(a.href)){e.preventDefault();window.clickedContacts.push(a.href);}},true)});
 for(const href of expected)await p.locator(`#contact a[href="${href}"]`).click();
 check(`${width}: all five main contact clicks`,JSON.stringify(await p.evaluate(()=>window.clickedContacts))===JSON.stringify(expected));
 if(width<768){await p.locator('[data-contact-open]').tap();check(`${width}: hero contact dialog`,await p.locator('#contact-dialog').isVisible());
  check(`${width}: dialog order`,JSON.stringify(await p.locator('#contact-dialog a').evaluateAll(a=>a.map(e=>e.href)))===JSON.stringify(expected));
  for(const href of expected)await p.locator(`#contact-dialog a[href="${href}"]`).tap();
  check(`${width}: five dialog contact clicks`,JSON.stringify((await p.evaluate(()=>window.clickedContacts)).slice(5))===JSON.stringify(expected));
  await p.screenshot({path:`${dir}/dialog-${width}.png`});for(let i=0;i<8;i++){await p.keyboard.press('Tab');assert.ok(await p.evaluate(()=>document.querySelector('#contact-dialog').contains(document.activeElement)));}await p.keyboard.press('Escape');await p.waitForFunction(()=>document.activeElement===document.querySelector('[data-contact-open]'));check(`${width}: dialog keyboard/close/focus`,true);
  await p.locator('.menu-toggle').tap();await p.locator('#menu-dialog a[href="#contact"]').tap();check(`${width}: menu Contacts`,!await p.locator('#menu-dialog').isVisible()&&p.url().endsWith('#contact'));
 }
 await p.emulateMedia({reducedMotion:'reduce'});check(`${width}: reduced motion`,await p.locator('.reveal').evaluateAll(a=>a.every(e=>getComputedStyle(e).opacity==='1')));
 check(`${width}: canonical/H1/Person`,await p.locator('h1').count()===1&&await p.locator('link[rel="canonical"]').getAttribute('href')==='https://evsavelev.github.io/evsavelev-web/'&&JSON.parse(await p.locator('[type="application/ld+json"]').textContent()).email==='evsavelev.region@gmail.com');
 report.screens.push({width,height,scrollSteps});await context.close();console.log('PASS',width,height);
}
const p=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await p.goto(base);await p.locator('[data-contact-open]').click();check('No JS hero CTA reaches contacts',p.url().endsWith('#contact'));await p.close();
const api=await browser.newContext();check('Real 404',(await api.request.get(base+'not-a-real-page-qa/')).status()===404);for(const file of ['sitemap.xml','robots.txt','assets/og.jpg'])check(`${file} 200`,(await api.request.get(base+file)).status()===200);await api.close();
check('No console/page errors',report.errors.length===0);report.result='PASS';
}finally{await browser.close();fs.writeFileSync(`${dir}/report.json`,JSON.stringify(report,null,2));}console.log('PASS',report.checks.length,'checks');})().catch(e=>{report.result='FAIL';report.failure=e.message;fs.writeFileSync(`${dir}/report.json`,JSON.stringify(report,null,2));console.error(e);process.exit(1)});
