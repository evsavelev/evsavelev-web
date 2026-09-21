const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(__dirname, '../dist/motion-v3');
const projects = require('../data/projects.json');
const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stages = [
 ['Исследование','Research','Разбираюсь в бизнесе, аудитории и задаче сайта. Определяю, что посетителю нужно узнать до обращения.'],
 ['Структура','Structure','Выстраиваю путь: предложение, услуги, реальные работы, ответы на вопросы и обращение.'],
 ['Каркас','Wireframe','Проверяю иерархию и расположение блоков до работы с цветом и изображениями.'],
 ['Дизайн','Design','Добавляю типографику, реальные материалы и визуальный характер вашего бизнеса.'],
 ['Разработка','Development','Собираю интерфейс, состояния элементов и доступную навигацию. Проверяю SEO и работу страницы.'],
 ['Мобильная версия','Mobile','Перестраиваю колонки, меню, изображения и действия под небольшой экран.'],
 ['Публикация','Publish','Проверяю ссылки, формы и адаптивность. Публикую сайт и проверяю его по реальному адресу.']
];
const services = [
 ['Структура','Путь от первого экрана до обращения: что важно показать и в каком порядке.','Предложение → работы → обращение'],
 ['Дизайн','Типографика, сетка и реальные изображения, которые представляют именно ваш бизнес.','Иерархия / цвет / изображения'],
 ['Тексты','Понятно объясняю предложение, состав работы и следующий шаг для посетителя.','Что вы делаете. Для кого. Как связаться.'],
 ['Разработка','Адаптивный интерфейс, навигация и честные состояния форм.','HTML / CSS / JavaScript'],
 ['Mobile','Отдельная композиция для смартфона с удобными кнопками и читаемым текстом.','Колонки → последовательность'],
 ['SEO','Заголовки, метаданные, семантика и базовая подготовка к индексации.','Title / description / headings'],
 ['Публикация','Размещение сайта и проверка ссылок, изображений и основных действий.','Проверка → запуск']
];
function canvas(stage=6, extra='') { return `<div class="build-canvas ${extra}" data-stage="${stage}" aria-hidden="true"><div class="canvas-grid"></div><div class="guides"></div><div class="site-object"><div class="browser-bar"><span>е/с</span><span class="address">evsavelev.github.io / web</span><span>↗</span></div><div class="mini-page"><div class="mini-nav"><b>Евгений Савельев</b><span class="mini-links">Работы &nbsp; Подход &nbsp; Контакты</span><span class="mini-menu">Меню ≡</span></div><div class="mini-layout"><div class="mini-copy"><span class="note-label">ЗАДАЧА / ПРЕДЛОЖЕНИЕ</span><strong>Сайт, который<br>представляет<br>ваш бизнес.</strong><p>Структура, дизайн и разработка. От первой идеи до публикации.</p></div><div class="mini-image"><span class="note-label">ДОКАЗАТЕЛЬСТВО / РАБОТЫ</span><img src="../assets/portfolio/tehnologiya-nizhnevartovsk-720.webp" width="1440" height="1000" alt="" loading="lazy"></div><div class="mini-action"><span class="note-label">СЛЕДУЮЩИЙ ШАГ</span><span class="mini-cta">Посмотреть демо ↗</span></div><div class="mini-footer"><span>Структура</span><span>Дизайн</span><span>Разработка</span></div></div></div><div class="dev-tags"><span>&lt;main&gt;</span><span>--accent: #FF4D24</span><span>grid: 12 columns</span></div></div><span class="canvas-state">ПРИМЕР СБОРКИ / СОБСТВЕННЫЙ САЙТ</span><span class="publish-mark">PUBLISHED</span></div>`; }
const projectHTML = projects.map((p,i)=>`<article class="project" id="project-${i+1}"><div class="project-title"><p class="meta">${String(i+1).padStart(2,'0')} / ${esc(p.niche)}</p><h3>${esc(p.name)}</h3></div><a class="project-media" href="${esc(p.url||`https://evsavelev.github.io/${p.slug}/`)}" target="_blank" rel="noopener noreferrer" aria-label="Открыть сайт ${esc(p.name)} в новой вкладке"><img src="../assets/portfolio/${p.slug}-1440.webp" srcset="../assets/portfolio/${p.slug}-720.webp 720w, ../assets/portfolio/${p.slug}-1440.webp 1440w" sizes="(min-width:1024px) 850px, calc(100vw - 40px)" width="1440" height="1000" loading="lazy" decoding="async" alt="Главная страница сайта «${esc(p.name)}»"><span aria-hidden="true">↗</span></a><div class="project-description"><p>${esc(p.task)}</p><p class="project-features">${p.features.map(esc).join(' · ')}</p><a class="text-link" href="${esc(p.url||`https://evsavelev.github.io/${p.slug}/`)}" target="_blank" rel="noopener noreferrer">Открыть сайт <span aria-hidden="true">↗</span></a></div></article>`).join('\n');
function publishPair(html){return html.replace('<span class="canvas-state">','<div class="publish-companion"><div class="mini-nav"><b>Евгений Савельев</b><span>≡</span></div><strong>Сайт, который представляет ваш бизнес.</strong><img src="../assets/portfolio/tehnologiya-nizhnevartovsk-720.webp" width="1440" height="1000" loading="lazy" alt=""><span class="mini-cta">Посмотреть демо ↗</span></div><span class="canvas-state">');}
let html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8')
 .replace('<!-- HERO_CANVAS -->',canvas(6,'hero-canvas'))
 .replace('<!-- SERVICES -->',services.map((s,i)=>`<details class="service" ${i===0?'open':''}><summary><span class="meta">0${i+1}</span><span class="service-name">${s[0]}</span><span class="service-plus" aria-hidden="true">+</span></summary><div class="service-content"><p>${s[1]}</p><div class="service-visual" data-service="${i}"><span class="meta">0${i+1} / ${s[0]}</span><strong>${s[2]}</strong>${i===1?'<img src="../assets/portfolio/vual-nizhnevartovsk-720.webp" width="1440" height="1000" loading="lazy" alt="Дизайн сайта салона Вуаль">':'<div class="service-diagram" aria-hidden="true"><i></i><i></i><i></i></div>'}</div></div></details>`).join(''))
 .replace('<!-- PROCESS_STAGES -->',stages.map((s,i)=>`<article class="process-step" data-step="${i}"><p class="meta">0${i+1} / ${s[1]}</p><h3>${s[0]}</h3><p>${s[2]}</p><div class="compact-canvas">${canvas(i)}</div></article>`).join(''))
 .replace('<!-- PROCESS_CANVAS -->',publishPair(canvas(0,'process-canvas')))
 .replace('<!-- PROJECTS -->',projectHTML)
 .replace('<!-- RESPONSIVE_CANVAS -->',canvas(6,'responsive-canvas'));
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'index.html'),html);
for(const file of ['styles.css','app.js','scenes.js','contact.js']) fs.copyFileSync(path.join(__dirname,file),path.join(out,file));
console.log(`Built Motion v3: ${projects.length} real projects, ${stages.length} process stages`);
