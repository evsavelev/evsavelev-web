const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const base = 'https://evsavelev.github.io/evsavelev-web/';
const projects = require('../data/projects.json');
const escape = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cards = projects.map((p,i) => `<article class="project reveal">
  <a class="project-image" href="${escape(p.url || `https://evsavelev.github.io/${p.slug}/`)}" target="_blank" rel="noopener noreferrer" aria-label="Открыть сайт ${escape(p.name)} в новой вкладке">
    <img src="assets/portfolio/${p.slug}-720.webp" srcset="assets/portfolio/${p.slug}-720.webp 720w, assets/portfolio/${p.slug}-1440.webp 1440w" sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1416px) calc((100vw - 96px) / 2), 644px" width="1440" height="1000" loading="lazy" decoding="async" alt="Главная страница сайта «${escape(p.name)}» — ${escape(p.niche.toLowerCase())}">
    <span class="preview-arrow" aria-hidden="true">↗</span>
  </a>
  <div class="project-caption"><span class="project-number">${String(i+1).padStart(2,'0')}</span><span>${escape(p.niche)}</span></div>
  <h3>${escape(p.name)}</h3><p class="project-task">${escape(p.task)}</p>
  <ul class="project-features">${p.features.map(f=>`<li>${escape(f)}</li>`).join('')}</ul>
  <a class="project-link" href="${escape(p.url || `https://evsavelev.github.io/${p.slug}/`)}" target="_blank" rel="noopener noreferrer">Открыть сайт <span aria-hidden="true">↗</span><span class="sr-only"> ${escape(p.name)}, в новой вкладке</span></a>
</article>`).join('\n');
const services=require('../data/services.json');
const pricing=services.map((s,i)=>`<article class="price-project ${i===0?'price-demo':''}"><div class="price-heading"><span class="eyebrow">${i===0?'Сначала познакомимся с идеей':String(i).padStart(2,'0')}</span><h3>${escape(s.name)}</h3></div><div class="price-description"><p>${escape(s.description)}</p>${i===0?'<p class="demo-terms">Без договора · без предоплаты<br>Без обязательств продолжать работу</p>':''}</div><div class="price-action"><p class="price-value">${escape(s.price)}</p><a href="#contact" class="button button-outline" data-service="${escape(s.selection)}">${escape(s.cta)} <span aria-hidden="true">↗</span></a></div></article>`).join('\n');
const options=[...services.map(s=>s.selection),'Другое'].map(s=>`<option>${escape(s)}</option>`).join('');
let html = fs.readFileSync(path.join(root,'index.html'),'utf8').replace('<!-- PROJECTS -->',cards).replace('<!-- PRICING -->',pricing).replace('<!-- SERVICE_OPTIONS -->',options);
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'index.html'),html);
for(const file of ['styles.css','app.js','request.js','404.html']) fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
fs.writeFileSync(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`);
fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}</loc></url></urlset>\n`);
fs.writeFileSync(path.join(out,'.nojekyll'),'');
console.log(`Built ${projects.length} projects → dist/`);
