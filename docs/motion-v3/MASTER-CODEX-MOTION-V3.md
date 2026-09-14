# MASTER-CODEX-MOTION-V3.md

# ЗАДАНИЕ CODEX — MOTION V3

Создай третью самостоятельную сравнительную версию сайта Евгения Савельева — **Motion v3 / Kinetic Editorial**.

## Источник требований

Перед изменением кода полностью прочитай и используй как единый контракт:

`docs/motion-v3/TZ-MOTION-V3.md`

`docs/motion-v3/DESIGN.md`

`docs/motion-v3/MOTION.md`

`docs/motion-v3/STORYBOARD.md`

`docs/motion-v3/QA-V3.md`

При конфликте приоритет такой:

**реальные данные и безопасность существующего сайта → ТЗ → DESIGN → MOTION → STORYBOARD → локальное техническое решение.**

Не придумывай новый визуальный стиль поверх этих документов.

---

# Рабочий репозиторий

`evsavelev/evsavelev-web`

Основной сайт и `/stitch-v2/` являются рабочими версиями и не должны быть визуально или функционально изменены.

---

# Шаг 1 — защита рабочего состояния

До существенных изменений:
- зафиксируй текущий commit;
- создай отдельный checkpoint/ветку для Motion v3;
- сними baseline основных production-файлов Main и Stitch v2;
- сохрани возможность отката.

Не начинай экспериментальные изменения непосредственно в рабочей Main-версии.

---

# Шаг 2 — архитектура

Создай автономную версию:

`/motion-v3/`

Предпочтительный стек:

`HTML + CSS + JavaScript`

Не вводи React/Next/Vue или другую SPA-архитектуру без реальной технической необходимости.

Для сложных scroll timeline допустимы `GSAP + ScrollTrigger`.

Простые hover, focus и transitions реализуй CSS.

Three.js/WebGL не использовать, если эффект можно качественно реализовать DOM/CSS/SVG.

---

# Шаг 3 — Visual Lock

Реализуй направление **Kinetic Editorial**.

База:
- тёплый off-white canvas;
- почти чёрная крупная typography;
- один vermilion/orange-red accent;
- видимая editorial grid;
- небольшие радиусы;
- отсутствие декоративной SaaS-card системы.

Не переносить dark-blue стиль Main.

Не переносить graphite/green Swiss Cyber стиль Stitch v2.

Не использовать:
- glassmorphism;
- cyberpunk;
- gaming;
- glow;
- fake terminal;
- Matrix;
- acid neon;
- generic AI landing visual language.

---

# Шаг 4 — контент

Используй реальные подтверждённые данные существующего сайта.

Не придумывай:
- опыт;
- количество клиентов;
- награды;
- сертификаты;
- метрики роста;
- сроки;
- отзывы;
- неподтверждённые результаты.

Сохрани реальные проекты и реальные ссылки.

Первые работы Portfolio:
1. «Международные расчёты для бизнеса»;
2. Bitok Consulting;
3. далее реальные проекты из текущего набора.

Не генерируй fake dashboard для демонстрации навыков.

---

# Шаг 5 — Hero

Реализуй signature sequence:

`grid → guides → bounding box → wireframe → design → finished website`

H1 и CTA доступны сразу.

Animation — progressive enhancement и не блокирует контент.

Переход Hero → следующая секция ощущается как transformation composition, а не fade-out.

---

# Шаг 6 — Services

Используй крупный editorial list вместо стандартной сетки одинаковых cards.

Desktop interaction показывает связанный preview.

Mobile использует отдельную touch-механику.

---

# Шаг 7 — Process

Реализуй главную scroll-driven сцену как **один изменяющийся canvas**:

`Research → Structure → Wireframe → Design → Development → Mobile → Publish`

Не превращай её в slideshow.

Не захватывай управление scroll пользователя.

На mobile реализуй сокращённую последовательную версию вместо длинного desktop sticky.

---

# Шаг 8 — Portfolio

Один реальный проект — одна крупная visual scene.

Project images важнее decorative animation.

Не использовать autoplay carousel.

Переходы между кейсами — сдержанные и по `MOTION.md`.

---

# Шаг 9 — Responsive demonstration

Отдельно реализуй сцену:

**desktop → responsive restructuring → mobile**

Interface должен действительно перестраиваться, а не просто масштабироваться.

---

# Шаг 10 — Pricing и Demo

После насыщенных сцен намеренно снизить motion intensity.

Сохранить реальную стоимость:

**Лендинг под ключ — от 35 000 ₽**

Demo CTA:

**Получить персональный демо-сайт**

**0 ₽ · без договора · без предоплаты**

Не использовать count-up цены.

---

# Шаг 11 — Contacts

Используй существующие реальные каналы связи и существующую честную механику подготовки обращения.

Не показывай ложное сообщение «отправлено», если backend ничего фактически не отправляет.

---

# Шаг 12 — Accessibility / fallback

Реализуй полноценный `prefers-reduced-motion`.

При reduced motion отключай:
- сложные transforms;
- parallax;
- magnetic interaction;
- cinematic timelines.

При отключённом JavaScript весь существенный контент и основные действия остаются доступны.

Keyboard navigation и `focus-visible` обязательны.

---

# Шаг 13 — Mobile

Mobile — самостоятельная composition, а не сжатый desktop.

Проверить минимум:
- 360px;
- 390px;
- 430px.

Не допускать:
- horizontal overflow;
- clipping;
- слишком длинных sticky scenes;
- overlaps CTA;
- мелких touch targets.

---

# Шаг 14 — Performance

Не жертвуй плавностью ради motion.

Используй `transform` и `opacity` там, где возможно.

Избегай постоянных layout recalculation и тяжёлых filters.

Оптимизируй images.

Не делай critical Hero dependent on тяжёлую motion-library.

---

# Шаг 15 — SEO сравнительной версии

До выбора Motion v3 основной версией установить:

`noindex, nofollow`

Canonical должен указывать на основной сайт.

Не добавлять `/motion-v3/` в основной sitemap.

Сохранить semantic HTML и корректные title/description/headings/alt.

---

# Шаг 16 — Automatic QA

Создай отдельный test scenario для Motion v3.

Используй существующие QA-подходы репозитория как baseline и добавь проверки из `QA-V3.md`.

Проверить минимум:
- 360×800;
- 390×844;
- 430×932;
- 768×1024;
- 1024×900;
- 1440×900;
- 1920×1080.

Проверить:
- console/page errors;
- overflow;
- broken assets;
- links;
- navigation;
- focus;
- no-JS;
- reduced-motion;
- ключевые состояния motion.

---

# Шаг 17 — Visual QA

Сохрани screenshots контрольных состояний из `STORYBOARD.md` и `QA-V3.md`.

Просмотри их визуально.

Не считай зелёный autotest достаточной проверкой дизайна.

---

# Шаг 18 — RedTeam

До публикации критически проверь результат.

Ищи:
- шаблонность;
- перегруженность animation;
- visual cheapness;
- проблемы mobile;
- слабый CTA;
- плохой contrast;
- motion без функции;
- случаи, где эффект мешает увидеть реальные проекты.

Существенные проблемы исправь до публикации.

---

# Шаг 19 — защита Main и Stitch

После разработки повторно сравни baseline существующих версий.

Root Main UI и `/stitch-v2/` не должны измениться.

Если publication требует изменения workflow/build, оно должно быть минимальным и исключительно добавочным.

---

# Шаг 20 — Git

Работай через отдельную branch/checkpoint.

После успешного локального QA сделай осмысленный commit.

Не отправляй непроверенную экспериментальную реализацию непосредственно в main.

После финального QA интегрируй только проверенную версию.

---

# Шаг 21 — публикация

Опубликуй Motion v3 отдельным URL:

`https://evsavelev.github.io/evsavelev-web/motion-v3/`

После deployment проверь фактический результат CI/Pages и production URL.

Повтори ключевой QA уже на опубликованной версии.

---

# Шаг 22 — итоговое сравнение

После готовности не объявляй Motion v3 автоматически лучшей.

Подготовь краткое сравнение:

**Main vs Stitch v2 vs Motion v3**

по критериям:
- понятность первого экрана;
- визуальный уровень;
- доверие;
- качество Portfolio;
- CTA;
- mobile UX;
- скорость;
- запоминаемость.

---

# Финальный формат отчёта

Заверши работу только после реального QA и публикации.

Выведи:

**ГОТОВО:** что реализовано.

**ПРОВЕРЕНО:** размеры, tests, motion-scenes, accessibility, performance, production.

**ИЗМЕНЕНО:** какие files и части deployment затронуты.

**НЕ ИЗМЕНЕНО:** подтверждение сохранности Main и Stitch v2.

**ОСТАЛОСЬ:** только реальные нерешённые вопросы.

**ССЫЛКИ:** Motion v3, Main, Stitch v2 и commit/branch.

Не используй формулировку «готово», если production URL ещё не проверен.
