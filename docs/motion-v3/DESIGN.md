# DESIGN.md — Motion v3 / Kinetic Editorial

## 1. Design statement

Motion v3 — третья самостоятельная сравнительная версия сайта Евгения Савельева.

Главный образ: **чистый редакционный canvas, на котором прямо при прокрутке проектируется и собирается коммерческий сайт.**

Направление: **Kinetic Editorial** — соединение швейцарской сетки, крупной digital-типографики, инженерной точности и режиссированного движения.

Сайт не должен выглядеть как SaaS-шаблон, cyberpunk, AI-лендинг, glassmorphism или демонстрация библиотеки эффектов.

---

## 2. Reference lock

Использовать принципы, а не копирование:

- Obys — единая система typography / grid / motion.
- Noomo — scroll как timeline и отдельная режиссура mobile.
- Portal — editorial grid, крупная типографика, линии и медиа.
- darkroom.engineering — инженерный характер и ощущение реальной разработки.
- Monolog — паузы и спокойные зоны между сильными сценами.

Не смешивать это направление с визуальными системами Main и Stitch v2.

---

## 3. Отличие от существующих версий

Main: premium dark / blue.

Stitch v2: graphite / bright green / Swiss Cyber Precision.

Motion v3: **light editorial / near-black typography / vermilion-orange accent / visible grid / kinetic layout.**

Цель — получить третью визуально самостоятельную систему для честного сравнения.

---

## 4. Палитра

Основной canvas:

`#F2F0EA`

Основной текст:

`#111111`

Вторичный текст:

`#66645F`

Линии / borders:

`#CAC7BF`

Светлая поверхность:

`#FAF9F5`

Инверсионная поверхность:

`#111111`

Основной акцент:

`#FF4D24`

Акцент используется только для:
- primary CTA;
- active state;
- progress;
- ключевого `0 ₽`;
- одной-двух важных графических точек.

Не вводить второй яркий accent.

Не использовать синий или зелёный как системный акцент v3.

---

## 5. Типографика

Основной шрифт: локальный **Inter Variable** из проекта.

Сила системы должна идти от масштаба, сетки, контраста и движения, а не от декоративной смены шрифтов.

### H1 desktop

`clamp(68px, 7.2vw, 124px)`

`font-weight: 650–750`

`line-height: .89–.96`

`letter-spacing: -0.055em`

### H2

`56–84px`

### H3

`28–36px`

### Body

`17–19px`

`line-height: 1.55`

### Meta / technical labels

`11–13px`

Допустим увеличенный tracking и короткие uppercase-метки.

Monospace использовать только для коротких индексов и технических labels:

`01 / STRATEGY`

`02 / STRUCTURE`

Не использовать monospace для обычных абзацев.

---

## 6. Grid

Максимальная ширина страницы:

`1440px`

Рабочий content container:

`1320px`

Desktop:
- 12 колонок;
- gap 20–24px;
- поля 48–64px.

Tablet:
- поля 32px.

Mobile:
- поля 20px;
- на 320px — 16px;
- одна основная колонка.

В отличие от Main и Stitch v2 часть направляющих может быть видима как элемент visual language.

Grid lines должны быть тонкими и функциональными, не декоративной сеткой поверх всего сайта.

---

## 7. Spacing

Базовая шкала:

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 112 / 144`

Desktop sections:

`96–144px`

Mobile sections:

`64–96px`

Сильные motion-сцены могут занимать больше вертикального пространства, но нельзя создавать пустые экраны ради animation.

---

## 8. Header

Компактный редакционный header.

Desktop:
- имя / знак слева;
- короткая navigation;
- CTA справа.

Начальная высота:

`72–80px`

После scroll:

`60–64px`

Фон может получать лёгкую непрозрачность и тонкую нижнюю линию.

Mobile:
- имя;
- menu button;
- простое полноэкранное или компактное раскрытие;
- без сложных floating panels.

---

## 9. Hero

Hero не строить по стандартной схеме «текст слева / картинка справа».

Он должен восприниматься как большой **артборд / редактор в процессе создания**.

### Системная метка

`EVGENY SAVELIEV / WEB DEVELOPMENT / 2026`

### Основной оффер

Предпочтительное направление:

**Сайты для бизнеса,  
которые сначала  
можно увидеть.**

### Подзаголовок

Коротко: проектирование, дизайн, разработка, mobile, SEO, публикация.

### CTA

**Получить демо →**

Подпись:

**0 ₽ · без договора · без предоплаты**

### Visual

Большая свободная рабочая зона, где последовательно появляются:

`grid → bounding box → wireframe → interface → finished site`

Hero обязан оставаться читаемым до и без animation.

---

## 10. Services

Не использовать стандартную карточочную сетку 3×2.

Использовать крупный vertical editorial list:

`01 Структура`

`02 Дизайн`

`03 Тексты`

`04 Разработка`

`05 Mobile`

`06 SEO`

`07 Публикация`

Строки разделены тонкими линиями.

Desktop active/hover state показывает связанный preview.

Mobile preview открывается под соответствующим пунктом.

---

## 11. Process

Главная signature-сцена сайта после Hero.

Desktop:
- левая треть — номер этапа, заголовок, описание;
- правые две трети — sticky canvas.

Один и тот же canvas проходит состояния:

`Research → Structure → Wireframe → Design → Development → Mobile → Publish`

Визуально это должен быть один объект, который постепенно становится готовым сайтом.

---

## 12. Portfolio

Портфолио не должно быть стандартной сеткой одинаковых карточек.

Один проект — одна крупная editorial scene.

Desktop:
- номер;
- название;
- ниша;
- короткое описание;
- крупный реальный screenshot;
- ссылка.

Один проект может занимать примерно `70–90vh`.

Реальные цвета проектов сохраняются.

Оболочка сайта остаётся нейтральной.

Приоритет первых работ:
1. «Международные расчёты для бизнеса»;
2. Bitok Consulting;
3. далее реальные проекты из существующего набора.

Не помещать каждый кейс в одинаковый MacBook mockup.

---

## 13. Desktop → Mobile scene

Обязательная отдельная секция.

Заголовок:

**Не уменьшаю desktop.  
Проектирую mobile.**

Desktop viewport должен реально перестраиваться:
- navigation;
- columns;
- spacing;
- image ratio;
- CTA placement.

Нельзя имитировать адаптацию простым scale.

---

## 14. Pricing

После сильных motion-сцен — intentionally quiet zone.

Крупно:

**Лендинг под ключ  
от 35 000 ₽**

Ниже спокойный перечень:
- структура;
- дизайн;
- разработка;
- mobile;
- базовое SEO;
- публикация.

Не использовать сложную тарифную таблицу без необходимости.

---

## 15. Demo CTA

Самая насыщенная цветом секция.

Фон:

`#FF4D24`

Текст:

`#111111`

Основная фраза:

**Сначала посмотрите.  
Потом решайте.**

Крупное:

**0 ₽**

CTA:

**Получить персональный демо →**

Подпись:

**без договора · без предоплаты**

Motion минимальный.

---

## 16. Contact / Footer

Контакты:
- WhatsApp;
- Telegram;
- MAX;
- Email.

Форма простая:
- телефон;
- комментарий.

Не создавать многоступенчатый funnel.

Footer — крупный typographic ending без большого количества колонок.

Финальная фраза может быть в духе:

**Есть бизнес. Давайте покажем его нормально.**

Текст подлежит финальной копирайтинговой проверке до публикации.

---

## 17. Buttons

Primary:
- accent background `#FF4D24`;
- near-black text;
- radius 4px;
- min-height 48px;
- padding примерно `14px 20px`.

Secondary:
- transparent;
- border `#111111` или системный neutral;
- radius 4px.

Hover — минимальный сдвиг arrow / border / background.

Не использовать large pill buttons без смысловой причины.

---

## 18. Surfaces / cards

Основные радиусы:

`0–6px`

Изображения:

`4–8px`

Не использовать:
- glass-card;
- большие 24–32px радиусы;
- массивные shadows;
- glow вокруг каждого блока.

Разделение создают:

**grid + line + spacing + typography + scale.**

---

## 19. Images

Использовать только реальные проекты и существующие материалы.

Не генерировать fake dashboard.

Screenshots должны быть крупными и читаемыми.

Device mockups использовать только там, где они помогают показать адаптивность.

WebP/AVIF, корректные dimensions, lazy loading ниже первого экрана.

---

## 20. Motion visual language

Четыре базовых действия:

**Reveal. Align. Transform. Replace.**

Не использовать как основной язык:
- bounce;
- spinning;
- elastic;
- flying cards;
- random zoom;
- постоянный glow.

Сайт должен двигаться как хорошо поставленная графическая композиция.

---

## 21. Motion intensity

Hero — `9/10`

Services — `4/10`

Process — `10/10`

Portfolio — `7/10`

Desktop → Mobile — `8/10`

Pricing — `2/10`

Demo CTA — `3/10`

Footer — `2/10`

Разница интенсивности обязательна.

---

## 22. Interaction

Cursor остаётся системным.

Допустимы:
- magnetic CTA 4–6px;
- очень лёгкий media parallax;
- preview по hover;
- motion линий и tracking.

Touch-версия cursor effects не эмулируется.

---

## 23. Mobile

Mobile — отдельная хореография.

Hero:

`оффер → CTA → build-animation`

Process:

`этап → compact canvas → следующий этап`

Portfolio:
- один проект за раз;
- full-width image;
- описание ниже.

Не переносить длинные desktop sticky-scenes механически.

---

## 24. Accessibility

Обязательно:
- semantic HTML;
- keyboard navigation;
- focus-visible;
- достаточный contrast;
- корректные button/link roles;
- `prefers-reduced-motion`.

Содержание не должно зависеть от завершения animation.

---

## 25. Performance principles

Motion не должен ухудшать коммерческую полезность.

Приоритет:
1. readability;
2. CTA;
3. smooth scroll;
4. motion.

Предпочтительно анимировать `transform` и `opacity`.

Не использовать WebGL/Three.js без объективной необходимости.

---

## 26. Do / Don't

### DO
- реальные проекты;
- крупная типографика;
- editorial grid;
- один accent;
- осмысленные motion-сцены;
- спокойные зоны между ними;
- отдельный mobile design;
- честные коммерческие условия.

### DON'T
- generic SaaS;
- cyberpunk;
- Matrix;
- gaming UI;
- fake code;
- fake metrics;
- giant glass cards;
- excessive glow;
- random animation;
- scrolljacking;
- скрытый до JS контент.

---

## 27. Final visual criterion

Пользователь не должен думать:

**«Здесь много эффектов».**

Он должен почувствовать:

**«Этот сайт очень хорошо спроектирован и сделан».**
