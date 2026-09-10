const {chromium}=require('@playwright/test'),assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.QA_URL||'http://127.0.0.1:4190/evsavelev-web/',dir=`qa/${base.startsWith('https:')?'public':'local'}/commercial`;
fs.mkdirSync(dir,{recursive:true});const report={base,date:new Date().toISOString(),checks:[],errors:[]};
const check=(label,value)=>{assert.ok(value,label);report.checks.push(label)};
(async()=>{const browser=await chromium.launch({channel:'chrome'});try{
for(const [width,height] of [[360,800],[390,844],[430,932],[768,1024],[1440,900]]){
 const c=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768});const p=await c.newPage();
 p.on('pageerror',e=>report.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
 // Intercept only the final mailto navigation sink to avoid starting an OS mail client.
 // Encoding, validation and all other delivered handler code execute unchanged.
 await p.route('**/request.js',async route=>{const response=await route.fetch(),source=await response.text();assert.ok(source.includes('window.location.href='));assert.ok(!/fetch\(|localStorage|sessionStorage|indexedDB/.test(source));await route.fulfill({response,body:source.replace('window.location.href=','window.__mail=')});});
 await p.goto(base,{waitUntil:'networkidle'});
 await p.evaluate(()=>{window.handoffs=[];window.clipboardText='';window.copyDenied=false;window.popupBlocked=false;window.open=(url)=>{window.handoffs.push(url);return window.popupBlocked?null:{opener:null,closed:false,location:{replace(url){window.handoffs.push(url)}},close(){}}};Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{if(window.copyDenied)throw Error('Denied');window.clipboardText=text}}});});
 check(`${width}: six prices`,await p.locator('.price-project').count()===6);
 await p.screenshot({path:`${dir}/hero-${width}.png`});
 for(const section of ['#prices','.included','.commercial-faq']){await p.locator(section).scrollIntoViewIfNeeded();await p.screenshot({path:`${dir}/${section.replace(/[#.]/g,'')}-${width}.png`});}
 const buttons=p.locator('[data-service]');
 for(let i=0;i<await buttons.count();i++){const button=buttons.nth(i),value=await button.getAttribute('data-service');await button.click();check(`${width}: prefill CTA ${i}`,await p.locator('#request-service').inputValue()===value);await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('#request-dialog').open);check(`${width}: focus return ${i}`,await button.evaluate(e=>document.activeElement===e));}
 await buttons.first().click();const form=p.locator('#request-form');
 for(const channel of ['whatsapp','telegram','max','email']){await form.locator(`[data-channel=${channel}]`).click();check(`${width}: invalid ${channel} focuses name`,await p.locator('#request-name').evaluate(e=>e===document.activeElement));}
 check(`${width}: invalid form opens nothing`,(await p.evaluate(()=>handoffs)).length===0);
 await p.locator('#request-name').fill('Анна & Пётр');await p.locator('#request-phone').fill('123');await form.locator('[data-channel=whatsapp]').click();check(`${width}: invalid phone`,await p.locator('#request-phone').getAttribute('aria-invalid')==='true');
 await p.locator('#request-phone').fill('+7 (999) 123-45-67');await p.locator('#request-comment').fill('Кафе & пекарня 🍞\nДва раздела + меню');
 await form.locator('[data-channel=whatsapp]').click();let text=await p.locator('#request-preview').inputValue();check(`${width}: complete demo message`,text.includes('Хочу получить бесплатное демо сайта.')&&text.includes('Анна & Пётр')&&text.includes('Кафе & пекарня 🍞\nДва раздела + меню'));
 let url=(await p.evaluate(()=>handoffs)).at(-1);check(`${width}: WhatsApp encoding`,new URL(url).searchParams.get('text')===text&&url.startsWith('https://wa.me/79088990088?text='));
 for(const channel of ['telegram','max']){await form.locator(`[data-channel=${channel}]`).click();await p.waitForFunction(()=>document.querySelector('.form-status').textContent.includes('Текст заявки скопирован'));check(`${width}: ${channel} clipboard`,await p.evaluate(()=>clipboardText)===text);check(`${width}: ${channel} exact profile`,(await p.evaluate(()=>handoffs)).at(-1)===await p.locator(`#contact a[href^="https://${channel==='max'?'max.ru':'t.me'}"]`).getAttribute('href'));}
 await p.evaluate(()=>{copyDenied=true;popupBlocked=true});await form.locator('[data-channel=max]').click();await p.waitForFunction(()=>document.querySelector('.form-status').textContent.includes('Автоматическое копирование недоступно'));
 check(`${width}: denied clipboard retains full message and direct link`,await p.locator('#request-preview').inputValue()===text&&await p.locator('.prepared-open').isVisible());
 await p.locator('[data-copy-request]').click();check(`${width}: manual selection fallback`,await p.locator('#request-preview').evaluate(e=>e.selectionEnd-e.selectionStart===e.value.length));
 await p.screenshot({path:`${dir}/form-fallback-${width}.png`});
 await p.evaluate(()=>{copyDenied=false});await p.locator('[data-copy-request]').click();await p.waitForFunction(()=>document.querySelector('.form-status').textContent.includes('Текст заявки скопирован'));
 await p.locator('#request-service').selectOption('Другое');await form.locator('[data-channel=whatsapp]').click();check(`${width}: other development message`,(await p.locator('#request-preview').inputValue()).includes('Хочу обсудить создание сайта.'));
 check(`${width}: no automatic email handoff`,await p.evaluate(()=>window.__mail===undefined));
 await form.locator('[data-channel=email]').click();const mail=new URL(await p.evaluate(()=>window.__mail));check(`${width}: email recipient subject Cyrillic and body encoding`,mail.pathname==='evsavelev.region@gmail.com'&&mail.searchParams.get('subject')==='Заявка с сайта — Другое'&&mail.searchParams.get('body')===await p.locator('#request-preview').inputValue());
 await p.locator('#request-dialog [data-close]').focus();for(let i=0;i<16;i++){await p.keyboard.press('Tab');check(`${width}: focus trapped ${i}`,await p.evaluate(()=>document.querySelector('#request-dialog').contains(document.activeElement)));}
 if(width<768){await p.setViewportSize({width,height:400});await p.locator('#request-comment').focus();await p.locator('#request-comment').scrollIntoViewIfNeeded();check(`${width}: short keyboard viewport scroll`,await p.locator('#request-dialog').evaluate(e=>e.clientHeight<400&&e.scrollHeight>e.clientHeight));await p.screenshot({path:`${dir}/keyboard-${width}.png`});await p.setViewportSize({width,height});}
 await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('#request-dialog').open&&document.querySelector('#request-name').value==='');check(`${width}: close clears personal fields`,await p.locator('#request-name').inputValue()===''&&await p.locator('#request-preview').inputValue()==='');
 const faq=p.locator('.commercial-faq summary').first();await faq.focus();await p.keyboard.press('Enter');check(`${width}: FAQ keyboard`,await faq.evaluate(e=>e.parentElement.open));
 if(width<768){await p.locator('.menu-toggle').click();await p.locator('#menu-dialog a[href="#prices"]').click();check(`${width}: mobile price navigation`,!await p.locator('#menu-dialog').isVisible()&&p.url().endsWith('#prices'));}
 check(`${width}: no horizontal scroll`,await p.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
 check(`${width}: no stored form data`,await p.evaluate(()=>localStorage.length===0&&sessionStorage.length===0));
 await c.close();console.log('PASS commercial',width);
}
check('No console/page errors',report.errors.length===0);report.result='PASS';
}finally{await browser.close();fs.writeFileSync(`${dir}/report.json`,JSON.stringify(report,null,2));}console.log('PASS',report.checks.length,'commercial checks');})().catch(e=>{report.result='FAIL';report.failure=e.stack;fs.writeFileSync(`${dir}/report.json`,JSON.stringify(report,null,2));console.error(e);process.exit(1)});
