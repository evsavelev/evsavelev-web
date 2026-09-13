# Stitch v2 — Swiss Cyber Precision / dark digital engineering

Дата: 2026-09-13. Сравнительная noindex-версия, полностью автономная папка /stitch-v2/.

## Главный референс и source lock
Экспорт владельца C:/Users/пк/Downloads/stitch_.zip: stitch_/screen.png, code.html, swiss_cyber_precision/DESIGN.md. Главный визуальный источник — этот экспорт, не предыдущий сайт. Сохранить графитовый холст, яркий зелёный, плотную композицию, жирную типографику, 2-up крупные проекты, 3-up тарифы с широким последним тарифом, технические тонкие границы. Не копировать вымышленные кейсы, цифры, сроки, SLA, отзывы, стек или псевдотерминал.

## Refero / три исследованных подхода
Применён refero-design, выполнены вызовы refero-free MCP refero_search по Supabase, Railway, Websmith Studio. Каталог 2026-09-12; попытка refero_refresh в этой же сессии закончилась сетевой ошибкой/timeout, используется резервный каталог. Полные Railway и Websmith уже прочитаны в предыдущем этапе; Supabase доступен как каталожная запись, полное чтение не заявляется.
1. Supabase (https://supabase.com, Refero 632249f1-fd78-4c77-9b34-7bae37ff3e9b): charcoal с одним зелёным функциональным акцентом. Самый близкий технический подход к Stitch; подтверждает выбранное направление.
2. Railway (https://railway.app): многослойные тёмные поверхности, outlined secondary action, ясные состояния. Берём только структуру состояния, без violet/serif/иллюстраций.
3. Websmith Studio (https://websmith.studio): жирный геометрический гротеск и крупные реальные превью в двух колонках. Берём только масштаб медиа; светлая кремовая система не переносится.
Главный выбор уже задан пользователем: Stitch Swiss Cyber Precision. Альтернативы не смешиваются в усреднённый стиль.

## Палитра / surfaces
Единый выбор между противоречивыми YAML и prose токенами экспорта: prose canvas + хорошо читаемый YAML primary.
- Canvas #0d0f12. Base panel #15181e. Raised #1c2129. Subtle #111419.
- Text #f3f4f6. Secondary #aeb5bf (ярче исходного #9ca3af для мелких подписей). Borders #30363f.
- Primary #4be277; hover #69ed91. Dark text on green #072812. Green subdued panel #14251c.
- Green: CTA, выбранный фильтр, акцент оффера и 0 ₽. Не использовать для неподтверждённых live/online статусов.
- Error #ffb4ab. Cyan и другие акценты не вводим: один основной цвет.

## Typography
Локальный Inter variable 100–900, копия файлов из репозитория, лицензия OFL рядом. Hanken Grotesk из внешнего CDN заменён локальным Inter 800, сохраняя вес, tracking и масштаб.
H1 62–66px desktop / 40–44px mobile, line-height 1.04, tracking -.045em; H2 38–44px / 30–34px; H3 21–25px / 20–22px. Body 15–17px, line-height 1.55–1.65. Labels не меньше 12px на mobile; системный monospace только для коротких индексов/номеров секций, не для абзацев. Никакого имитационного кода ради декора.

## Grid / spacing
Max 1248px. Desktop поля 48px, 12-column logic, gap24. Tablet 32px, 2-column work/pricing. Mobile поля20 (16 на320), 1 column. Базовая шкала4/8/12/16/24/32/48/64/80.
Header80/72px; hero padding48–56px; секции64–80px desktop,48–56px mobile. Композиция заметно плотнее предыдущей, без пустых высот и giant spacer.
Hero 6/6: слева оффер и CTA, справа реальный интерфейс в browser-frame. Преимущества компактным рядом, демо остаётся заметным. Mobile: оффер, CTA, превью.

## Cards / buttons / fields
Карточки проектов: два столбца, dominant image, radius8, border1px, padding16 для превью/20–24 для текста. Цвета исходных скриншотов сохранены; без тяжёлых overlay. Клиентские названия из data/projects.json, без метрик результата.
Тарифы: три карточки в первой строке, каталог + широкий индивидуальный во второй. На tablet две колонки, mobile одна. Цена видна всегда. Возможности зависят от согласованной задачи. Зелёный контур обозначает выбор/акцент предложения, не «самый популярный» без данных.
Primary button green/dark text, secondary transparent/light text, border #46515e. Radius4, min-height48, padding14 20. Hover 180ms border/background и 2px arrow move. Без glows по всему экрану.
Form fields: min-height48, dark bg, border#4a525f, radius4, font16. Явные labels; name, контакт, формат, комментарий. Форма только готовит сообщение. Никакого ложного уведомления об отправке.

## Responsive / interaction
360/390/430: один столбец, CTA по ширине/два ряда при необходимости, 40–44px hero; короткие названия фильтров, перенос в строки, без horizontal scroller.
768: 2-col проекты и тарифы, hero одна колонка, max preview width600.1024: split hero, сокращённая навигация.1440: полная сетка1248.
Native disclosure/mobile menu без offscreen traps. Карточки видны без JS; JS добавляет фильтры и «ещё проекты». Кнопки фильтров aria-pressed; сообщение количества role=status. CTA тарифов выбирает формат в финальной форме и ведёт к ней.
:focus-visible 2px green + offset4. Reduced motion отключает перемещения/плавную прокрутку. Нет autoplay, видео, fixed overlays, scrolljacking.

## Decision ledger
| Решение | Источник | Роль | Причина |
|---|---|---|---|
| Graphite + green | Stitch + Supabase catalog | Фон/CTA/выбор | Технический деловой характер |
| Inter 800/700 | Локальный шрифт + Stitch type scale | Оффер/иерархия | Без CDN и микротекста |
| Browser frame реального проекта | Stitch HUD + пользовательский запрет выдумок | Доказательство | Вместо fake code/99 PageSpeed |
| 2-up work, 3-up pricing | Stitch screen | Сравнение | Крупные работы и заметные цены |
| Тёмные уровни / границы | Stitch + Railway | Интерактивная группировка | Чёткая плотная структура |
| Крупные оригинальные превью | Websmith project pattern + реальные assets | Портфолио | Проверяемое качество работ |
| Прямые каналы и честная подготовка сообщения | ТЗ | Контакт | Без неподтверждённого backend |
| noindex/nofollow, основной canonical | ТЗ | Сравнительная версия | Не конкурировать в поиске |

## Do / don't / RedTeam
DO: живые ссылки, реальные превью, прямо указывать 0 ₽/условия, цены/домен/хостинг. Проверять все размеры, фокус, формы, broken assets, root hashes.
DON'T: gaming, cyberpunk, Matrix, hacker-console, жирный неон, spinning displays, фальшивые online/status/metrics, результаты, сроки, команды, awards. Не утверждать CMS/backend/CRM без подтверждения.
QA и RedTeam — QA.md. Root baseline — main306e203; previous blue redesign — checkpoint db8c70f; изменения root-interface запрещены.
