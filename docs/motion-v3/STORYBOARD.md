# STORYBOARD.md — Motion v3 / Kinetic Editorial

## Назначение

Storyboard фиксирует ключевые визуальные состояния страницы Motion v3 до разработки.

Он используется вместе с:
- `TZ-MOTION-V3.md`;
- `DESIGN.md`;
- `MOTION.md`;
- `QA-V3.md`.

Главная цель — зафиксировать контрольные состояния, через которые должна пройти страница.

---

## FRAME 01 — HERO / INITIAL

Пользователь только открыл страницу.

### Композиция

Светлый off-white canvas.

Сверху:
- Евгений Савельев;
- короткая навигация;
- CTA.

Крупный H1:

**Сайты для бизнеса,  
которые сначала  
можно увидеть.**

Под ним:
- короткое описание;
- CTA «Получить демо»;
- `0 ₽ · без договора · без предоплаты`.

Рядом или за текстом — почти пустая рабочая зона с тонкой сеткой.

### Motion state

Только начинает появляться grid.

### Задача

Оффер должен быть понятен даже без дальнейшей animation.

---

## FRAME 02 — HERO / STRUCTURE

Примерно 300–500ms после загрузки.

В рабочей зоне появились:
- вертикальные guides;
- horizontal guides;
- bounding box.

H1 полностью виден.

CTA доступен.

Главное ощущение:

**из пустого пространства появляется порядок**

---

## FRAME 03 — HERO / WIREFRAME

Внутри bounding box:
- placeholder hero;
- image block;
- text lines;
- CTA;
- lower section.

Всё пока нейтрально-серое.

Пользователь должен визуально понимать: сайт сначала собирается по структуре.

---

## FRAME 04 — HERO / FINAL DESIGN

Wireframe превращён в полноценный интерфейс.

Видны:
- typography;
- images;
- color;
- CTA;
- browser frame.

Grid частично остаётся как конструкционный слой.

Главное ощущение:

**идея → результат**

---

## FRAME 05 — HERO → SERVICES

Пользователь начинает scroll.

Hero уменьшается примерно до `92–94%`.

Часть grid lines продолжается вниз.

Большой текст начинает уходить вверх.

Browser frame превращается в visual element следующего блока.

Переход без общего fade-out.

---

## FRAME 06 — SERVICES

Heading:

**Что я делаю**

Крупный список:

`01 Структура`  
`02 Дизайн`  
`03 Тексты`  
`04 Разработка`  
`05 Mobile`  
`06 SEO`  
`07 Публикация`

Thin divider lines.

Активный пункт немного смещён.

Справа появляется крупный preview соответствующего этапа.

Ощущение:

**редакционный каталог компетенций**

---

## FRAME 07 — PROCESS / RESEARCH

Heading:

**Как собирается сайт**

Левая колонка:
- `01`;
- «Исследование»;
- краткое описание.

Справа — большой sticky canvas.

На нём:
- notes;
- keywords;
- small blocks;
- контролируемая исходная композиция.

Ощущение:

**ещё нет сайта — только информация**

---

## FRAME 08 — PROCESS / STRUCTURE + WIREFRAME

Notes уже выстроились по grid.

Видны:
- hero;
- services;
- portfolio;
- CTA;
- footer.

Всё — wireframe blocks.

Левая колонка:

`02 Структура`

затем

`03 Wireframe`

Главная идея:

**хаос превращается в архитектуру**

---

## FRAME 09 — PROCESS / DESIGN

Тот же canvas.

Wireframe постепенно получает:
- real typography;
- images;
- background;
- CTA;
- accent.

Левая колонка:

`04 Дизайн`

Не менять экран целиком — меняется состояние одного interface.

Ощущение:

**структура становится продуктом**

---

## FRAME 10 — PROCESS / DEVELOPMENT

Готовый интерфейс остаётся главным.

Поверх него кратко появляются:
- breakpoint label;
- grid values;
- CSS token;
- DOM-like marker.

Левая колонка:

`05 Разработка`

Запрет:
- никаких терминалов на полэкрана;
- никакого fake code.

---

## FRAME 11 — PROCESS / MOBILE

Desktop canvas начинает сужаться.

В этот момент видно:
- две колонки становятся одной;
- navigation перестраивается;
- CTA меняет width/position;
- images меняют ratio;
- spacing сокращается.

Левая колонка:

`06 Mobile`

Это реальная перестройка layout, не scale.

---

## FRAME 12 — PROCESS / PUBLISH

Technical guides исчезают.

В финале видны:
- desktop;
- mobile.

Interface чистый и законченный.

Может появиться маленькая метка:

`PUBLISHED`

Левая колонка:

`07 Публикация`

Ощущение:

**готовый коммерческий продукт**

---

## FRAME 13 — PORTFOLIO

Один проект занимает почти весь экран.

Слева/сверху:
- номер;
- название;
- ниша;
- краткое описание;
- link.

Основную площадь занимает реальный screenshot.

Следующий проект слегка виден снизу.

При scroll текущий preview слегка уменьшается, следующий входит снизу.

Работы должны быть главным доказательством уровня.

---

## FRAME 14 — DESKTOP → MOBILE DEMONSTRATION

Heading:

**Не уменьшаю desktop.  
Проектирую mobile.**

Большой browser frame.

Рядом или поверх — mobile viewport.

Между ними визуально читается transformation structure.

Desktop постепенно перестраивается в mobile interface.

---

## FRAME 15 — PRICE / QUIET ZONE

Почти статичный экран.

Крупно:

**Лендинг под ключ  
от 35 000 ₽**

Ниже:
- структура;
- дизайн;
- разработка;
- mobile;
- базовое SEO;
- публикация.

Motion минимальный.

Задача — дать пользователю визуально отдохнуть.

---

## FRAME 16 — FINAL CTA

Background:

`#FF4D24`

Крупный текст:

**Сначала посмотрите.  
Потом решайте.**

Крупное:

**0 ₽**

CTA:

**Получить персональный демо →**

Подпись:

**без договора · без предоплаты**

Только line reveal и лёгкий scale для `0 ₽`.

---

## FRAME 17 — CONTACT / FOOTER

Спокойный финальный фон.

Большая финальная фраза.

Контакты:
- WhatsApp;
- Telegram;
- MAX;
- Email.

Простая форма:
- телефон;
- комментарий.

Только однократный typographic reveal.

Финальное ощущение:

**спокойствие и уверенность**

---

# MOBILE STORYBOARD

## Mobile A — Hero

Порядок:

`H1 → описание → CTA → 0 ₽ → build-animation`

Рабочая сцена идёт после оффера, а не конкурирует с ним.

---

## Mobile B — Services

Vertical list.

Tap открывает небольшой preview.

Никаких floating panels.

---

## Mobile C — Process

Вместо длинной sticky-сцены:

**этап → mini-canvas → следующий этап**

Пользователь постоянно движется вниз.

---

## Mobile D — Portfolio

Один проект за раз.

Full-width image.

Описание под изображением.

---

## Mobile E — CTA

Accent section занимает значительную часть viewport.

CTA крупный и удобный для touch.

---

# VISUAL RHYTHM

Страница чередует:

**сильная сцена  
→ спокойный блок  
→ сильная сцена  
→ портфолио  
→ спокойный блок  
→ CTA**

Не делать:

**wow → wow → wow → wow → wow**

Иначе эффект перестаёт работать.

---

# QA CONTROL FRAMES

После разработки обязательно получить screenshots минимум следующих состояний:

1. Hero initial.
2. Hero final.
3. Services active state.
4. Process research.
5. Process wireframe.
6. Process design.
7. Process mobile.
8. Process published.
9. Portfolio first project.
10. Desktop→mobile transformation.
11. Pricing.
12. CTA.
13. Mobile hero.
14. Mobile process.
15. Mobile portfolio.

Эти screenshots сравниваются со storyboard до публикации.

---

# RED FLAGS

Реализация не соответствует storyboard, если:
- Hero похож на generic SaaS dashboard;
- motion добавлен поверх обычного лендинга;
- каждая секция использует одинаковый fade-up;
- Process выглядит как slideshow;
- Mobile — уменьшенный desktop;
- Portfolio спрятано за эффектами;
- используются fake dashboard / fake terminal;
- всё движется одновременно;
- пользователь вынужден ждать animation;
- CTA хуже заметен из-за motion.

---

# FINAL PRINCIPLE

Storyboard должен восприниматься как одна история:

**пустой лист  
→ структура  
→ дизайн  
→ разработка  
→ адаптация  
→ реальные проекты  
→ предложение  
→ контакт.**

Если новая эффектная идея ломает эту последовательность, от неё нужно отказаться.
