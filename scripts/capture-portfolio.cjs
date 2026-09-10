const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const names=['tehnologiya-nizhnevartovsk','vual-nizhnevartovsk','kinder-party-dom-nizhnevartovsk','style-dance-nizhnevartovsk','gildiya-law-nizhnevartovsk','autodoctor-nizhnevartovsk','billboard-nizhnevartovsk','imperiya-beauty-nizhnevartovsk','volodya-remont-nizhnevartovsk','delovoy-nizhnevartovsk','international-business-settlements'];
(async()=>{fs.mkdirSync('qa/source-sites',{recursive:true});const browser=await chromium.launch({channel:'chrome'});const report=[];
for(const name of names){const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});const url='https://evsavelev.github.io/'+name+'/';try{
 const r=await page.goto(url,{waitUntil:'networkidle',timeout:45000});
 await page.evaluate(async()=>{await Promise.all([...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight).map(i=>i.decode().catch(()=>{})))});
 await page.waitForTimeout(700);await page.screenshot({path:`qa/source-sites/${name}.png`});
 const content=await page.locator('body').innerText();fs.writeFileSync(`qa/source-sites/${name}.txt`,content);
 report.push({name,url,status:r.status(),title:await page.title(),h1:await page.locator('h1').allTextContents(),description:await page.locator('meta[name=description]').getAttribute('content').catch(()=>null),text:content.slice(0,1800),screenshot:`qa/source-sites/${name}.png`});console.log(name,r.status());
}catch(e){report.push({name,url,error:e.message});console.log(name,e.message)}await page.close()}
fs.writeFileSync('qa/portfolio-inventory.json',JSON.stringify(report,null,2));await browser.close()})().catch(e=>{console.error(e);process.exit(1)});
