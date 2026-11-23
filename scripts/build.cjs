const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const base = 'https://evsavelev.ru/';
const isProduction = process.env.PRODUCTION === '1';
const projects = require('../data/projects.json');
const services = require('../data/services.json');
const assetVersion = '20260925-6';
const catalogVersion = '20261123-1';

const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));

const projectUrl = project => project.url || `https://evsavelev.github.io/${project.slug}/`;

const homeClass = index => {
  const classes = ['project--wide','project--side','','','project--side','project--wide','',''];
  return classes[index] || '';
};

const card = (project, index, {prefix = '', editorial = false} = {}) => {
  const extraClass = editorial ? homeClass(index) : '';
  return `<article class="project-card ${extraClass} reveal">
    <a class="project-media" href="${escape(projectUrl(project))}" target="_blank" rel="noopener noreferrer" aria-label="Открыть сайт ${escape(project.name)} в новой вкладке">
      <img src="${prefix}assets/portfolio/${project.slug}-720.webp?v=${assetVersion}"
           srcset="${prefix}assets/portfolio/${project.slug}-720.webp?v=${assetVersion} 720w, ${prefix}assets/portfolio/${project.slug}-1440.webp?v=${assetVersion} 1440w"
           sizes="${editorial ? '(max-width: 767px) calc(100vw - 32px), 70vw' : '(max-width: 767px) calc(100vw - 32px), 50vw'}"
           width="1440" height="1000" loading="${index < 6 ? 'eager' : 'lazy'}" decoding="async"
           alt="Главная страница сайта «${escape(project.name)}» — ${escape(project.niche.toLowerCase())}">
      <span class="project-open" aria-hidden="true">↗</span>
    </a>
    <div class="project-meta"><span>${String(index + 1).padStart(2,'0')} / ${escape(project.niche)}</span><span>WEB</span></div>
    <h3>${escape(project.name)}</h3>
    <p>${escape(project.task)}</p>
    <a class="project-link" href="${escape(projectUrl(project))}" target="_blank" rel="noopener noreferrer">Смотреть проект ↗</a>
  </article>`;
};

const homeProjects = projects.slice(0, 8).map((project, index) => card(project, index, {editorial:true})).join('\n');
const allProjects = projects.map((project, index) => card(project, index, {prefix:'../'})).join('\n');

const activeServices = services.filter(service => service.active).sort((a, b) => a.order - b.order);
const demo = activeServices.find(service => service.id === 'demo');
const categories = Object.groupBy(activeServices.filter(service => service.startPrice > 0), service => service.category);
const formatPrice = service => {
  const amount = new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency: service.currency, maximumFractionDigits: 0
  }).format(service.startPrice).replaceAll('\u00a0', ' ');
  return service.startPrice > 0 ? `от ${amount}` : amount;
};

const pricing = Object.entries(categories).map(([category, items], index) => `<section class="price-group" aria-labelledby="price-group-${index + 1}">
  <h3 id="price-group-${index + 1}">${escape(category)}</h3>
  ${items.map(service => `<article class="price-item" id="service-${escape(service.id)}" aria-labelledby="service-${escape(service.id)}-title">
    <div class="price-copy">
      <h4 id="service-${escape(service.id)}-title">${escape(service.name)}</h4>
      <p>${escape(service.summary)}</p>
      <details class="price-details">
        <summary aria-describedby="service-${escape(service.id)}-title">Подробнее</summary>
        <p>${escape(service.description)}</p>
      </details>
    </div>
    <div class="price-action">
      <p class="price-value">${escape(formatPrice(service))}</p>
      <a href="#contact" class="button button-small" data-service="${escape(service.id)}" aria-describedby="service-${escape(service.id)}-title">${escape(service.cta)} <span aria-hidden="true">↗</span></a>
    </div>
  </article>`).join('\n  ')}
</section>`).join('\n');

const serviceOption = service => `<option value="${escape(service.id)}" data-name="${escape(service.name)}">${escape(`${service.name} — ${formatPrice(service)}`)}</option>`;
const options = [
  serviceOption(demo),
  ...Object.entries(categories).map(([category, items]) =>
    `<optgroup label="${escape(category)}">${items.map(serviceOption).join('')}</optgroup>`),
  '<option value="other" data-name="Другое">Другое</option>'
].join('\n');

const metrikaHead = isProduction ? `<!-- Yandex.Metrika counter -->
<script type="text/javascript">
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=113000419', 'ym');

ym(113000419, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
</script>
<!-- /Yandex.Metrika counter -->` : '';

const metrikaBody = isProduction ? `<!-- Yandex.Metrika counter: fallback without JavaScript -->
<noscript><div><img src="https://mc.yandex.ru/watch/113000419" style="position:absolute; left:-9999px;" alt=""></div></noscript>
<!-- /Yandex.Metrika counter -->` : '';

const render = (template, replacements) => Object.entries(replacements)
  .reduce((html, [marker, value]) => html.replaceAll(marker, () => value), template);

const mainTemplate = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const projectsTemplate = fs.readFileSync(path.join(root, 'projects', 'index.html'), 'utf8');

const mainHtml = render(mainTemplate, {
  '<!-- HOME_PROJECTS -->': homeProjects,
  '<!-- PRICING -->': pricing,
  '<!-- SERVICE_OPTIONS -->': options,
  '{{DEMO_PRICE}}': escape(formatPrice(demo)),
  '{{CATALOG_VERSION}}': catalogVersion,
  '<!-- ANALYTICS_HEAD -->': metrikaHead,
  '<!-- ANALYTICS_BODY -->': metrikaBody
});

const projectsHtml = render(projectsTemplate, {
  '<!-- ALL_PROJECTS -->': allProjects,
  '{{DEMO_PRICE}}': escape(formatPrice(demo)),
  '{{CATALOG_VERSION}}': catalogVersion,
  '<!-- ANALYTICS_HEAD -->': metrikaHead,
  '<!-- ANALYTICS_BODY -->': metrikaBody
});

fs.rmSync(out, {recursive:true, force:true});
fs.mkdirSync(out, {recursive:true});
fs.mkdirSync(path.join(out, 'projects'), {recursive:true});

fs.writeFileSync(path.join(out, 'index.html'), mainHtml);
fs.writeFileSync(path.join(out, 'projects', 'index.html'), projectsHtml);

for (const file of ['styles.css','app.js','request.js','404.html']) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}

fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), {recursive:true});

fs.writeFileSync(path.join(out, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`);

fs.writeFileSync(path.join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}</loc></url>\n  <url><loc>${base}projects/</loc></url>\n</urlset>\n`);

fs.writeFileSync(path.join(out, '.nojekyll'), '');

console.log(`Built homepage with ${Math.min(projects.length, 8)} featured projects and archive with ${projects.length} projects → dist/`);
