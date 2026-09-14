# MOTION.md — Motion v3 / Kinetic Editorial

## 0. Назначение

Этот документ определяет поведение, анимацию и scroll-режиссуру версии **Motion v3**.

Motion не добавляется после дизайна. Он является частью композиции страницы наравне с типографикой, сеткой и контентом.

Главный принцип:

**Reveal → Align → Transform → Replace**

Все движения должны выглядеть как проектирование интерфейса, а не как набор спецэффектов.

---

## 1. Общий характер движения

Характер:

**точный / инженерный / спокойный / кинетический / уверенный**

Не использовать:
- bounce;
- elastic;
- вращающиеся карточки;
- случайные zoom;
- чрезмерный blur;
- бесконечные floating-объекты;
- scrolljacking;
- искусственное торможение скролла.

Пользователь всегда управляет страницей обычным скроллом.

Motion должен подчиняться сетке.

---

## 2. Базовые параметры

Micro interaction:

`160–240ms`

Обычный reveal:

`350–600ms`

Крупный transition:

`600–1000ms`

Scroll-driven сцены работают по progress секции, а не по фиксированному времени.

Основной easing:

`cubic-bezier(0.22, 1, 0.36, 1)`

Для спокойных переходов:

`cubic-bezier(0.4, 0, 0.2, 1)`

Linear допускается только для элементов, жёстко связанных со scroll progress.

---

## 3. Производительность

По возможности анимировать только:

`transform`

`opacity`

Не анимировать постоянно:
- width;
- height;
- top;
- left;
- большие box-shadow;
- filter blur на крупных областях.

Не создавать заметные layout shift.

---

## 4. Page load / fallback

До запуска JS весь основной контент должен быть читаемым.

Нельзя скрывать H1, CTA и контакты до инициализации motion.

JavaScript только улучшает презентацию.

---

## 5. Header

### Initial

Высота desktop:

`72–80px`

Содержимое:
- имя / знак;
- короткая navigation;
- CTA.

### Scroll

После примерно `80–120px` скролла header уменьшается до `60–64px`.

Допускается лёгкая непрозрачность background и тонкая border line.

Duration:

`220ms`

Не скрывать header полностью.

Mobile — упрощённая версия без тяжёлого blur.

---

## 6. Hero — Signature Scene 01

### Цель

Показать:

**из пустой структуры появляется полноценный коммерческий сайт.**

Пользователь видит оффер и CTA сразу.

### Initial state

На экране доступны:
- имя;
- H1;
- описание;
- CTA;
- `0 ₽ · без договора · без предоплаты`.

В рабочей зоне — лёгкая сетка.

### Load sequence

#### 0–250ms

Появляется основная grid.

`opacity 0 → 1`

#### 150–450ms

Появляются основные guides, будто рисуются.

SVG stroke animation допустим.

#### 300–700ms

Появляется bounding box будущего interface.

`scale .985 → 1`

`opacity 0 → 1`

#### 450–900ms

Появляются wireframe blocks:
- hero;
- image;
- CTA;
- text.

Они появляются на своих местах, а не прилетают с краёв экрана.

#### 700–1200ms

Wireframe превращается в реальный design:
- images;
- typography;
- color;
- buttons.

#### 900–1400ms

Browser frame становится законченным.

Финальное состояние — спокойное.

---

## 7. Hero H1

H1 не вылетает по словам.

Использовать line reveal через overflow mask.

Initial:

`translateY(105%)`

Final:

`translateY(0)`

Stagger:

`60–90ms`

Duration:

`650–800ms`

CTA появляется после начала H1.

Delay примерно:

`450–550ms`

CTA motion:

`opacity 0 → 1`

`translateY(8px → 0)`

Без bounce.

---

## 8. Hero → next section

Переход не должен быть fade-out.

### Scroll progress 0–1

`0.00–0.20` — hero почти статичен.

`0.20–0.45` — рабочая зона уменьшается `scale 1 → .92`.

`0.35–0.65` — H1 слегка уходит вверх, grid lines продолжаются вниз.

`0.55–0.85` — browser frame становится частью следующей composition.

`0.85–1.00` — hero уступает место следующей секции.

---

## 9. Section reveal system

Использовать три основных паттерна:

### A. Line reveal

Для крупных heading и акцентного текста.

### B. Grid reveal

Для структурных списков и системных блоков.

### C. Media reveal

Для images и interface previews.

В одной секции одновременно использовать максимум два паттерна.

---

## 10. Services

Desktop:
- номер;
- название;
- короткое описание;
- divider.

Hover/active:
- название смещается на `8–12px`;
- divider усиливается;
- справа появляется соответствующий preview.

Preview:

`opacity 0 → 1`

`scale .985 → 1`

Duration:

`240–320ms`

Scroll entrance rows:

stagger `50–80ms`, движение не более `12px`.

### Mobile

Hover отсутствует.

Tap раскрывает краткое описание и preview.

Без spring / bounce.

---

## 11. Process — Signature Scene 02

### Цель

Один canvas проходит через несколько состояний.

Нельзя создавать независимый slideshow.

Desktop:
- слева текст текущего этапа;
- справа sticky canvas.

### Timeline

#### Stage 01 — Research / 0.00–0.14

Canvas содержит:
- заметки;
- ключевые слова;
- небольшие блоки.

Вход через opacity и малое смещение.

#### Stage 02 — Structure / 0.14–0.30

Заметки выстраиваются по grid.

Лишние элементы исчезают.

Появляются sections, containers и базовая hierarchy.

Главный приём:

**хаос → порядок**

#### Stage 03 — Wireframe / 0.30–0.46

Notes заменяются wireframe.

Replace должен выглядеть как изменение состояния того же canvas, не dissolve всей сцены.

#### Stage 04 — Design / 0.46–0.63

Wireframe получает:
- color;
- images;
- real typography;
- CTA.

Сначала структура, затем оформление.

#### Stage 05 — Development / 0.63–0.76

К интерфейсу кратко добавляются:
- grid;
- breakpoint label;
- CSS variable token;
- DOM-like marker.

Не превращать это в fake terminal.

#### Stage 06 — Mobile / 0.76–0.90

Desktop viewport сужается.

Layout реально перестраивается:
- columns;
- CTA;
- menu;
- image ratios;
- spacing.

Не использовать простой scale.

#### Stage 07 — Publish / 0.90–1.00

Technical guides исчезают.

Остаётся чистый опубликованный interface.

Desktop/mobile могут появиться рядом.

Допустима маленькая метка `PUBLISHED` как состояние animation.

### Process text

Старый текст:

`opacity 1 → 0`

`translateY 0 → -8px`

Новый:

`opacity 0 → 1`

`translateY 8px → 0`

Transition:

`180–260ms`

### Mobile process

Длинная sticky scene отключается.

Каждый этап — отдельная compact scene.

Все данные читаются без ожидания animation.

---

## 12. Portfolio

Один проект = одна крупная сцена.

Не использовать autoplay carousel.

### Entrance

Последовательность:
1. номер;
2. название;
3. image;
4. описание.

Stagger:

`70–100ms`

### Media

`scale 1.03 → 1`

`opacity .7 → 1`

Duration:

`600–850ms`

Scale почти незаметный.

### Project transition

Previous:

`scale 1 → .985`

Next:

`translateY 40px → 0`

Предыдущий проект естественно покидает viewport.

### Link hover

Arrow moves `4–6px`.

Underline/border растёт слева направо.

Duration:

`180–220ms`

---

## 13. Desktop → Mobile scene

Initial: desktop site в browser frame.

`0–0.25` — frame сужается.

`0.25–0.55` — grid перестраивается.

`0.55–0.75` — header становится mobile navigation.

`0.75–0.90` — images и CTA меняют position.

`0.90–1.00` — остаётся полноценный mobile viewport.

Подпись:

**Mobile — отдельный интерфейс, а не уменьшенная копия desktop.**

---

## 14. Pricing

После сильной сцены движение сознательно успокаивается.

Heading — simple line reveal.

Цена появляется сразу.

Не использовать count-up от 0 до 35 000.

Detail rows:

`opacity`

и максимум `translateY 6px`

stagger `40–60ms`.

---

## 15. Demo CTA

Off-white фон сменяется на accent без длинного gradient morph.

Headline:

**Сначала посмотрите. Потом решайте.**

Line reveal.

`0 ₽`:

`scale .97 → 1`

`opacity 0 → 1`

Duration:

`450–550ms`

CTA может иметь лёгкий magnetic effect на desktop.

Максимальное смещение:

`4–6px`

На mobile magnetic effect отключён.

---

## 16. Form

Не использовать сложные floating labels.

Focus:
- accent border;
- лёгкая смена background;
- без glow.

Error:
- border;
- error text;
- icon при необходимости.

Не использовать shake.

---

## 17. Footer

Финальная типографическая фраза может иметь однократный reveal при входе.

Контакты статичны.

Footer завершает страницу спокойно.

---

## 18. Microinteractions

Все clickable элементы должны иметь:
- default;
- hover;
- focus-visible;
- active;
- disabled, если применимо.

Links:

`180ms`

Buttons:

`180–240ms`

Interactive rows/cards:

`220–300ms`

---

## 19. Pointer / cursor

Использовать системный cursor.

Не создавать giant custom cursor.

Pointer tracking допускается только для:
- preview;
- media parallax;
- magnetic CTA.

Отключать при:

`pointer: coarse`

---

## 20. Parallax

Очень ограниченно.

Амплитуда:

`10–24px`

Не использовать сильное движение background относительно текста.

Изображение не должно открывать пустые края.

---

## 21. Text motion

Не разбивать каждый абзац на отдельные слова.

Word-by-word animation — максимум один раз на странице.

Основной паттерн:

**line reveal**

---

## 22. Loading

Не создавать процентный preloader.

Не заставлять пользователя ждать hero animation.

Страница доступна сразу.

---

## 23. Reduced motion

При `prefers-reduced-motion: reduce` отключить:
- scroll transforms;
- parallax;
- magnetic effects;
- long morph;
- cinematic sticky transitions.

Оставить мгновенные state changes и короткие opacity transitions до `100–150ms`, если они не мешают.

Весь контент должен находиться в финальном читаемом состоянии.

---

## 24. Responsive strategy

Основные режимы:

`≤767px` — mobile choreography.

`768–1023px` — tablet simplified motion.

`≥1024px` — full motion.

Также учитывать:
- `pointer: coarse`;
- reduced-motion;
- реальную производительность устройства при необходимости.

---

## 25. JavaScript architecture

Motion-логика разделяется по сценам.

Не создавать один гигантский файл с сотнями inline handler.

Архитектура должна позволять отдельно выключать:
- hero;
- process;
- portfolio;
- desktop→mobile scene.

Observers/listeners должны корректно очищаться, где это необходимо.

---

## 26. GSAP

GSAP + ScrollTrigger допускается для:
- hero timeline;
- process timeline;
- desktop→mobile transformation;
- сложных scroll transformations.

Не использовать GSAP для каждой кнопки и hover.

Простые эффекты — CSS.

---

## 27. No-JS fallback

Без JS должны работать и быть видимыми:
- Hero;
- услуги;
- проекты;
- pricing;
- CTA;
- контакты.

Нельзя строить критический content исключительно внутри canvas.

---

## 28. Accessibility

Animation не должна:
- менять focus;
- мешать keyboard navigation;
- скрывать focused element;
- создавать focus trap внутри sticky scene.

Sticky-секции должны нормально проходиться клавиатурой и screen reader.

---

## 29. Acceptance — Hero

Hero готов, если:
- оффер читается сразу;
- CTA доступен до окончания animation;
- build sequence выглядит как единая сборка;
- нет layout jump;
- mobile имеет отдельную choreography.

---

## 30. Acceptance — Process

Process готов, если:
- последовательность этапов понятна без дополнительной инструкции;
- canvas изменяется как один объект;
- нет резких jumps;
- sticky не блокирует пользователя;
- mobile остаётся простой.

---

## 31. Acceptance — Portfolio

Portfolio готово, если:
- реальные работы остаются главным visual content;
- motion не мешает рассматривать проект;
- links доступны;
- scroll естественный.

---

## 32. Performance acceptance

Недопустимы:
- console errors;
- scroll freezes;
- заметный jank;
- layout shifts;
- horizontal overflow;
- animation lag на типичном смартфоне.

Если эффект конфликтует с производительностью, эффект упрощается.

---

## 33. Motion intensity map

Hero — `9/10`

Services — `4/10`

Process — `10/10`

Portfolio — `7/10`

Desktop → Mobile — `8/10`

Pricing — `2/10`

Demo CTA — `3/10`

Footer — `2/10`

Если всё двигается одинаково сильно, Motion v3 считается неудачной.

---

## 34. Final principle

Пользователь не должен думать:

**«На этом сайте много анимации».**

Он должен почувствовать:

**«Этот сайт очень хорошо сделан».**
