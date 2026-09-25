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

must(home.includes('<link rel="canonical" href="https://evsavelev.ru/">'), 'home canonical');
must(home.includes('<meta property="og:url" content="https://evsavelev.ru/">'), 'home og:url');
must(home.includes('https://evsavelev.ru/assets/og.jpg'), 'home og:image');
must(home.includes('"@id":"https://evsavelev.ru/#person"'), 'Schema.org person id');
must(home.includes('"url":"https://evsavelev.ru/"'), 'Schema.org person url');

must(projects.includes('<link rel="canonical" href="https://evsavelev.ru/projects/">'), 'projects canonical');
must(projects.includes('<meta property="og:url" content="https://evsavelev.ru/projects/">'), 'projects og:url');
must(projects.includes('https://evsavelev.ru/assets/og.jpg'), 'projects og:image');
must(home.includes('styles.css?v=20260925-5'), 'home CSS cache bust');
must(home.includes('app.js?v=20260925-5'), 'home app JS cache bust');
must(home.includes('request.js?v=20260925-5'), 'home request JS cache bust');
must(projects.includes('../styles.css?v=20260925-5'), 'projects CSS cache bust');
must(projects.includes('../app.js?v=20260925-5'), 'projects app JS cache bust');
must(home.includes('kinder-party-dom-nizhnevartovsk-720.webp?v=20260925-5'), 'Kinder Party thumbnail cache bust');
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

for (const price of ['от 17 500 ₽','от 30 000 ₽','от 50 000 ₽','от 65 000 ₽','от 80 000 ₽']) {
  must(home.includes(price), 'discounted price ' + price);
}
for (const price of ['от 35 000 ₽','от 60 000 ₽','от 100 000 ₽','от 130 000 ₽','от 160 000 ₽']) {
  must(home.includes(price), 'regular price ' + price);
}

must(robots.includes('User-agent: *'), 'robots user agent');
must(robots.includes('Allow: /'), 'robots allow');
must(robots.includes('Sitemap: https://evsavelev.ru/sitemap.xml'), 'robots sitemap');
must(sitemap.includes('<loc>https://evsavelev.ru/</loc>'), 'sitemap home');
must(sitemap.includes('<loc>https://evsavelev.ru/projects/</loc>'), 'sitemap projects');
must(!sitemap.includes('github.io'), 'sitemap has no GitHub Pages URL');
must(notFound.includes('href="/"'), '404 returns to production root');
must(fs.existsSync(path.join(root,'assets','og.jpg')), 'OpenGraph image exists');
must(fs.existsSync(path.join(root,'assets','favicon.svg')), 'favicon exists');

for (const token of ['<!-- HOME_PROJECTS -->','<!-- PRICING -->','<!-- SERVICE_OPTIONS -->','<!-- ALL_PROJECTS -->']) {
  must(!home.includes(token) && !projects.includes(token), 'build placeholder resolved: ' + token);
}

if (!process.exitCode) console.log('Production package QA: OK');
