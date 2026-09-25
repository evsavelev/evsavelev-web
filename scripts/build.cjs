const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const base = 'https://evsavelev.ru/';
const isProduction = process.env.PRODUCTION === '1';
const projects = require('../data/projects.json');
const services = require('../data/services.json');

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
      <img src="${prefix}assets/portfolio/${project.slug}-720.webp"
           srcset="${prefix}assets/portfolio/${project.slug}-720.webp 720w, ${prefix}assets/portfolio/${project.slug}-1440.webp 1440w"
           sizes="${editorial ? '(max-width: 767px) calc(100vw - 32px), 70vw' : '(max-width: 767px) calc(100vw - 32px), 50vw'}"
           width="1440" height="1000" loading="${index < 2 ? 'eager' : 'lazy'}" decoding="async"
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

const pricingMeta = [
  {
    audience:'Для одной услуги, продукта, рекламной кампании или отдельного направления.',
    duration:'Ориентир: 7–14 рабочих дней',
    included:['Структура одной страницы','Индивидуальный дизайн','Адаптивная разработка','Форма обращения и контакты']
  },
  {
    audience:'Для бизнеса, которому нужно представить компанию, услуги, работы и преимущества.',
    duration:'Ориентир: 2–3 недели',
    included:['Структура основных разделов','Дизайн и мобильная версия','Страницы услуг и компании','Формы и контакты']
  },
  {
    audience:'Для компаний с несколькими направлениями и большим объёмом информации.',
    duration:'Ориентир: 3–5 недель',
    included:['Многостраничная архитектура','Единая дизайн-система','Разделы направлений','Интеграции по задаче']
  },
  {
    audience:'Для производителей, поставщиков и бизнеса с большим ассортиментом.',
    duration:'Ориентир: 4–6 недель',
    included:['Категории и карточки','Фильтрация и навигация','Адаптивный интерфейс','Управление ассортиментом по задаче']
  },
  {
    audience:'Для нестандартных сценариев, CMS, админ-панели, личного кабинета или специальных интеграций.',
    duration:'Срок — после оценки задачи',
    included:['Проработка сценариев','Индивидуальные интерфейсы','Нужные интеграции','Разработка под согласованный функционал']
  }
];

const pricing = services.slice(1).map((service, index) => {
  const meta = pricingMeta[index];
  return `<details class="price-item reveal" data-price-name="${escape(service.name)}" ${index === 0 ? 'open' : ''}>
    <summary>
      <h3>${escape(service.name)}</h3>
      <span class="price-stack"><span class="price-old">${escape(service.regularPrice || '')}</span><span class="price-value">${escape(service.price)}</span></span>
      <span class="price-plus" aria-hidden="true">+</span>
    </summary>
    <div class="price-detail">
      <div>
        <p class="price-detail-intro">${escape(meta.audience)}</p>
        <p class="price-scope">${escape(meta.duration)}</p><p class="price-promo-note">Цена со скидкой 50% до 31.12.2026</p>
      </div>
      <div>
        <div class="price-specs">
          <div><h4>Что входит</h4><ul>${meta.included.map(item => `<li>${escape(item)}</li>`).join('')}</ul></div>
          <div><h4>Формат</h4><ul><li>${escape(service.description)}</li><li>Мобильная версия</li><li>Базовая SEO-подготовка</li><li>Техническая проверка и публикация</li></ul></div>
        </div>
        <div class="price-cta">
          <p class="price-scope">Точный объём, сроки и стоимость фиксируем до начала основной разработки.</p>
          <a href="#contact" class="button" data-service="${escape(service.selection)}">${escape(service.cta)} ↗</a>
        </div>
      </div>
    </div>
  </details>`;
}).join('\n');

const options = [...services.map(service => service.selection), 'Другое']
  .map(value => `<option>${escape(value)}</option>`)
  .join('');

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
  .reduce((html, [marker, value]) => html.replace(marker, value), template);

const mainTemplate = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const projectsTemplate = fs.readFileSync(path.join(root, 'projects', 'index.html'), 'utf8');

const mainHtml = render(mainTemplate, {
  '<!-- HOME_PROJECTS -->': homeProjects,
  '<!-- PRICING -->': pricing,
  '<!-- SERVICE_OPTIONS -->': options,
  '<!-- ANALYTICS_HEAD -->': metrikaHead,
  '<!-- ANALYTICS_BODY -->': metrikaBody
});

const projectsHtml = render(projectsTemplate, {
  '<!-- ALL_PROJECTS -->': allProjects,
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
fs.writeFileSync(path.join(out, 'yandex_2c17695f91526c09.html'), 'Verification: 2c17695f91526c09\n');

console.log(`Built homepage with ${Math.min(projects.length, 8)} featured projects and archive with ${projects.length} projects → dist/`);
