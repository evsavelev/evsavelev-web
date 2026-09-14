# QA-V3.md — Motion v3 / Kinetic Editorial

## 1. Цель проверки

Motion v3 считается готовой не тогда, когда «анимации работают», а когда движение усиливает сайт и не ухудшает понятность, скорость, доступность, mobile UX и конверсионный путь.

Проверка выполняется после реализации и ещё раз после публикации.

---

## 2. Критические уровни

| Уровень | Значение | Решение |
|---|---|---|
| P0 | Сайт или ключевой путь не работает | Публикация запрещена |
| P1 | Проблема с CTA, mobile, контентом, motion или доступностью | Исправить до публикации |
| P2 | Заметный визуальный или UX-дефект | Исправить до финального показа |
| P3 | Косметическая мелочь | Можно исправить после основной приёмки |

Для показа заказчику допускается только состояние без нерешённых P0/P1/P2.

---

## 3. Матрица экранов

Обязательные viewport:

| Устройство | Размер |
|---|---:|
| Mobile S | 360×800 |
| Mobile M | 390×844 |
| Mobile L | 430×932 |
| Tablet | 768×1024 |
| Small desktop | 1024×900 |
| Desktop | 1440×900 |
| Wide desktop | 1920×1080 |

На всех размерах проверяется полная прокрутка страницы.

---

## 4. Общая визуальная приёмка

Должно сохраняться направление **Kinetic Editorial**:
- off-white canvas;
- near-black typography;
- один vermilion/orange-red accent;
- строгая editorial grid;
- небольшие радиусы;
- отсутствие SaaS/glassmorphism-визуала.

Нельзя допускать возврата к стилистике Main или Stitch v2.

Особенно проверить отсутствие:
- системного blue/green accent;
- больших glow;
- cyberpunk;
- glass-card;
- одинаковой карточочной сетки по всей странице.

---

## 5. Hero

Hero должен пройти состояния:

| Этап | Ожидаемый результат |
|---|---|
| Initial | Оффер и CTA читаются сразу |
| Grid | Видна лёгкая конструкционная сетка |
| Structure | Появляются guides и bounding box |
| Wireframe | Читается каркас interface |
| Design | Wireframe превращается в полноценный UI |
| Final | Получается спокойный законченный экран |
| Scroll transition | Hero естественно переходит в следующую секцию |

Пользователь не должен ждать завершения sequence, чтобы прочитать оффер или нажать CTA.

При отключённом JavaScript Hero остаётся полноценным и понятным.

---

## 6. Services

Desktop interaction проверяется мышью и клавиатурой.

Active item должен менять preview без layout jump.

На touch devices hover-механика не должна использоваться.

Mobile version должна раскрывать содержание тапом или последовательным layout без скрытых недоступных данных.

---

## 7. Process — главная motion-проверка

Вручную проверить все состояния одного canvas:

`Research → Structure → Wireframe → Design → Development → Mobile → Publish`

Между ними должна ощущаться трансформация одного объекта.

Если сцена воспринимается как slideshow из отдельных экранов, реализация не проходит приёмку.

Sticky не должен удерживать пользователя искусственно и не должен ломать normal scroll.

Нельзя захватывать wheel/touch events для принудительного прохождения сцены.

---

## 8. Desktop → Mobile

Проверяется реальное изменение layout.

Недопустимо просто уменьшить desktop через `scale()`.

В ходе transition должны изменяться:
- columns;
- navigation;
- spacing;
- images;
- CTA position.

---

## 9. Portfolio

Используются только реальные проекты и реальные изображения.

Motion не должен мешать открыть проект, рассмотреть изображение или прочитать описание.

Все project links должны быть проверены.

Autoplay carousel запрещён.

---

## 10. Pricing и Demo CTA

Стоимость должна быть доступна без взаимодействия.

Не использовать animated count-up цены.

Demo должен явно показывать:

**0 ₽ · без договора · без предоплаты**

Основной CTA остаётся заметнее декоративных motion-elements.

---

## 11. Motion RedTeam

Во время полной прокрутки проверить:
- одинаковый fade-up во всех секциях;
- слишком много одновременного движения;
- animation ради animation;
- чрезмерный parallax;
- fake terminal / fake code;
- cursor-follow decoration без функции;
- тяжёлые blur/glow;
- rotations / bounce;
- scrolljacking;
- длинные задержки;
- контент, который нельзя прочитать до завершения animation;
- transitions, мешающие быстро прокрутить страницу;
- motion, который выглядит эффектнее портфолио;
- desktop animation, механически перенесённую на mobile;
- заметную потерю плавности.

Любой эффект без функциональной причины удаляется или упрощается.

---

## 12. Reduced Motion

Проверить:

`prefers-reduced-motion: reduce`

В этом режиме отключить:
- сложные scroll transforms;
- parallax;
- magnetic effects;
- cinematic timelines;
- длинные morph.

Контент должен находиться в нормальном конечном состоянии.

Navigation и смысл страницы не зависят от animation.

---

## 13. No-JS

При отключённом JavaScript доступны:
- Hero offer;
- Services;
- Process в текстовом виде;
- Portfolio;
- Pricing;
- Demo CTA;
- Contacts.

Нельзя получать пустые секции вместо motion-canvas.

---

## 14. Keyboard / Accessibility

Проверить Tab по всей странице.

Focus-visible должен быть хорошо заметен.

Sticky/motion scenes не создают focus trap.

Focused element не должен уезжать из viewport из-за animation.

Semantic HTML обязателен.

Buttons остаются buttons, links — links.

---

## 15. Mobile First QA

На 360/390/430 отдельно проверить:
- Header;
- Menu;
- H1;
- CTA;
- Services;
- Process;
- Portfolio;
- Pricing;
- Form;
- Footer.

Не допускаются:
- horizontal scroll;
- clipped headings;
- overlaps;
- слишком маленькие touch targets;
- sticky scenes, которые трудно пройти;
- desktop hover logic на touch.

---

## 16. Performance

Не допускаются:
- console errors;
- page errors;
- постоянный jank;
- заметный CLS;
- scroll freezes.

Critical Hero content не должен ждать загрузки тяжёлой motion library.

GSAP допустим для сложных timeline, но simple hover/reveal остаются CSS.

Three.js/WebGL не добавлять, если ту же сцену можно качественно реализовать HTML/CSS/SVG.

Лабораторная цель LCP:

`≤ 2.5s`

CLS:

`≤ 0.1`, желательно близко к нулю.

Performance metrics — диагностика, а не обещание одинаковой скорости на любом устройстве.

---

## 17. Network / Assets

Проверить отсутствие:
- broken assets;
- внутренних 404;
- ошибок fonts/images/scripts.

Images below fold — lazy loading там, где уместно.

WebP/AVIF и корректные dimensions обязательны для крупных изображений.

Не подключать внешние fonts/CDN без необходимости.

---

## 18. SEO сравнительной версии

До выбора v3 основной версией установить:

`noindex, nofollow`

Canonical указывает на основной сайт.

`/motion-v3/` не добавляется в основной sitemap.

Сохранить корректные:
- H1-H3;
- title;
- description;
- alt;
- semantic HTML.

---

## 19. Сохранность существующих версий

До работ зафиксировать baseline Main и `/stitch-v2/`.

После разработки сравнить рабочие файлы.

Main UI и Stitch v2 не должны измениться.

Допускается только минимальное добавочное изменение deployment/build configuration, если оно нужно для публикации `/motion-v3/`.

---

## 20. Контрольные screenshots

Обязательно сохранить и визуально просмотреть:

1. Hero initial.
2. Hero final.
3. Services active state.
4. Process Research.
5. Process Wireframe.
6. Process Design.
7. Process Mobile.
8. Process Published.
9. Portfolio first project.
10. Desktop→Mobile.
11. Pricing.
12. Demo CTA.
13. Mobile Hero.
14. Mobile Process.
15. Mobile Portfolio.

Screenshots сравниваются с `STORYBOARD.md`.

---

## 21. Production QA

После публикации проверить реальный URL `/motion-v3/`.

Повторить основные desktop/mobile scenarios:
- HTTP 200;
- real assets;
- console/page errors;
- anchors;
- portfolio links;
- CTA;
- contacts;
- full scroll.

Локальный HTTP 200 не заменяет production validation.

---

## 22. Final RedTeam

Перед принятием результата ответить:

**Понятно ли предложение за несколько секунд?**

**Выглядит ли v3 дороже, а не просто более анимированной?**

**Работы Евгения остаются главным доказательством?**

**Стало ли проще захотеть демо?**

**На mobile сайт всё ещё удобнее, чем эффектнее?**

Если хотя бы один ответ отрицательный из-за motion, соответствующая сцена перерабатывается.

---

## 23. Definition of Done

Motion v3 готова к сравнению только когда:
- нет P0/P1/P2;
- контрольные states соответствуют storyboard;
- Main и Stitch v2 сохранены;
- Mobile работает;
- Reduced Motion работает;
- No-JS fallback работает;
- Production URL проверен;
- сайт можно показать без пояснения «анимации ещё доделаем».
