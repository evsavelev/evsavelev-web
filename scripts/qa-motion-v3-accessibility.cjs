const {chromium}=require('@playwright/test');
const fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.QA_URL||'http://127.0.0.1:4203/evsavelev-web/motion-v3/index.html';
const axePath=process.env.AXE_PATH||require.resolve('axe-core/axe.min.js');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];try{
 for(const width of [360,768,1440]){const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await p.goto(base);await p.addScriptTag({path:axePath});
 const violations=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});results.push({width,violations});assert.deepEqual(violations,[]);
 if(width===360){await p.locator('.menu-toggle').click();const menuIssues=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>v.id)});assert.deepEqual(menuIssues,[]);}
 await p.close();}
 const dir=`qa/motion-v3/${base.startsWith('https')?'production':'local'}`;fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(`${dir}/accessibility.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
