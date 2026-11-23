const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../dist');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const must = (condition, message) => {
  if (!condition) {
    console.error('PRODUCTION QA FAILED:', message);
    process.exitCode = 1;
  }
};

const home = read('index.html');
const projects = read('projects/index.html');
const robots = read('robots.txt');
const sitemap = read('sitemap.xml');
const notFound = read('404.html');


// 2GIS review: authentic source, unchanged featured projects, both navigations and CTA destinations.
const reviewUrl = 'https://2gis.ru/nizhnevartovsk/firm/70000001118870070/tab/reviews';
must(home.includes('class="editorial-grid"'), 'featured real project thumbnails preserved');
must(home.includes('id="reviews"'), 'reviews section');
must(home.indexOf('id="projects"') < home.indexOf('id="reviews"') &&
  home.indexOf('id="reviews"') < home.indexOf('id="process"'), 'reviews immediately after featured projects');
must(home.includes('Андрей Савельев') && home.includes('Биток-консалтинг'), 'verified author and client project');
must(home.includes('Результатом очень доволен!'), 'real verified review excerpt');
must(home.includes('class="review-stars" role="img" aria-label="Оценка 5 из 5 звёзд"'), 'accessible 5-star review');
must(home.includes('Читать отзывы на 2ГИС') && home.includes('Оставить отзыв'), 'both review CTAs');
must(home.split(reviewUrl).length - 1 === 2, 'both review CTAs lead to the public 2GIS reviews page');
must(home.includes('<a href="#reviews">Отзывы</a>') &&
  home.includes('<a href="#reviews">Отзывы <span>↗</span></a>'), 'home desktop/mobile review navigation');
must(projects.includes('<a href="../#reviews">Отзывы</a>') &&
  projects.includes('<a href="../#reviews">Отзывы <span>↗</span></a>'), 'projects desktop/mobile review navigation');

must(home.includes('<link rel="canonical" href="https://evsavelev.ru/">'), 'home canonical');
must(home.includes('<meta property="og:url" content="https://evsavelev.ru/">'), 'home og:url');
must(home.includes('https://evsavelev.ru/assets/og.jpg'), 'home og:image');
must(home.includes('"@id":"https://evsavelev.ru/#person"'), 'Schema.org person id');
must(home.includes('"url":"https://evsavelev.ru/"'), 'Schema.org person url');

must(projects.includes('<link rel="canonical" href="https://evsavelev.ru/projects/">'), 'projects canonical');
must(projects.includes('<meta property="og:url" content="https://evsavelev.ru/projects/">'), 'projects og:url');
must(projects.includes('https://evsavelev.ru/assets/og.jpg'), 'projects og:image');
const stylesVersion = home.match(/href="styles\.css\?v=([\d-]+)"/)?.[1];
const appVersion = home.match(/src="app\.js\?v=([\d-]+)"/)?.[1];
must(stylesVersion && projects.includes(`../styles.css?v=${stylesVersion}`), 'shared CSS cache bust');
must(appVersion && projects.includes(`../app.js?v=${appVersion}`), 'shared app JS cache bust');
must(/src="request\.js\?v=[\d-]+"/.test(home), 'home request JS cache bust');
must(home.includes('kinder-party-dom-nizhnevartovsk-720.webp?v=20260925-6'), 'Kinder Party thumbnail cache bust');
must(home.includes('loading="eager"'), 'eager portfolio image loading present');

for (const [name, html] of [['home', home], ['projects', projects]]) {
  must(html.includes("mc.yandex.ru/metrika/tag.js?id=113000419"), name + ' Yandex Metrika loader');
  must(html.includes("ym(113000419, 'init'"), name + ' Yandex Metrika init');
  must(html.includes('mc.yandex.ru/watch/113000419'), name + ' Yandex Metrika noscript');
  must(!html.includes('evsavelev.github.io/evsavelev-web'), name + ' has no old GitHub Pages production URL');
  must(!html.includes('name="robots" content="noindex'), name + ' is indexable in production');
  must(!html.includes('<!-- ANALYTICS_HEAD -->'), name + ' analytics placeholder resolved');
  must(!html.includes('<!-- ANALYTICS_BODY -->'), name + ' analytics body placeholder resolved');
}

const expectedCatalog = [
  ['business-card', 'Сайт-визитка', 'от 17 500 ₽'],
  ['landing', 'Разработка современного продающего лендинга', 'от 25 000 ₽'],
  ['corporate', 'Корпоративный сайт', 'от 50 000 ₽'],
  ['catalog', 'Сайт-каталог', 'от 65 000 ₽'],
  ['custom-project', 'Индивидуальный проект', 'от 80 000 ₽'],
  ['bug-fixes', 'Исправление ошибок на сайте', 'от 2 000 ₽'],
  ['support', 'Техническая поддержка сайта', 'от 3 000 ₽'],
  ['site-improvements', 'Доработка существующего сайта', 'от 3 000 ₽'],
  ['redesign', 'Редизайн сайта', 'от 15 000 ₽'],
  ['basic-seo', 'Базовая SEO-оптимизация', 'от 5 000 ₽'],
  ['telegram-bot', 'Чат-бот для Telegram', 'от 10 000 ₽'],
  ['hosting-migration', 'Перенос сайта на другой хостинг', 'от 3 000 ₽']
];
const priceItems = [...home.matchAll(/<article class="price-item"[^>]*>[\s\S]*?<\/article>/g)].map(([html]) => html);
must(priceItems.length === expectedCatalog.length, 'exactly 12 paid services');
must((home.match(/<section class="price-group"/g) || []).length === 6, 'six named service categories');
must((home.match(/<h1[\s>]/g) || []).length === 1, 'one home H1');
for (const [index, [id, name, price]] of expectedCatalog.entries()) {
  const card = priceItems[index] || '';
  must(card.includes(`id="service-${id}"`) && card.includes(`>${name}</h4>`) &&
    card.includes(`class="price-value">${price}</p>`) && card.includes(`data-service="${id}"`), `card and price for ${id}`);
  must(home.includes(`<option value="${id}" data-name="${name}">${name} — ${price}</option>`), `form option for ${id}`);
}
must(home.includes('<option value="demo" data-name="Бесплатное демо">Бесплатное демо — 0 ₽</option>'), 'free demo in form');
must(!/(?:скидк[аиу] 50|[−-]50%|31 декабря 2026|31\.12\.2026|от (30|35|60|100|130|160) 000 ₽|price-old)/iu.test(home), 'no expired promotion or obsolete prices');

must(robots.includes('User-agent: *'), 'robots user agent');
must(robots.includes('Allow: /'), 'robots allow');
must(robots.includes('Sitemap: https://evsavelev.ru/sitemap.xml'), 'robots sitemap');
must(sitemap.includes('<loc>https://evsavelev.ru/</loc>'), 'sitemap home');
must(sitemap.includes('<loc>https://evsavelev.ru/projects/</loc>'), 'sitemap projects');
must(!sitemap.includes('github.io'), 'sitemap has no GitHub Pages URL');
must(notFound.includes('href="/"'), '404 returns to production root');
must(fs.existsSync(path.join(root,'assets','og.jpg')), 'OpenGraph image exists');
must(fs.existsSync(path.join(root,'assets','favicon.svg')), 'favicon exists');

for (const token of ['<!-- HOME_PROJECTS -->','<!-- PRICING -->','<!-- SERVICE_OPTIONS -->','<!-- ALL_PROJECTS -->','{{CATALOG_VERSION}}','{{DEMO_PRICE}}']) {
  must(!home.includes(token) && !projects.includes(token), 'build placeholder resolved: ' + token);
}

if (!process.exitCode) console.log('Production package QA: OK');
