# evsavelev.ru — production deployment

## Цель
Production-сборка утверждённой версии Request v4 для основного домена https://evsavelev.ru/.

## Что сохраняется
- основной домен: https://evsavelev.ru/
- существующий HTTPS/Let's Encrypt и серверные редиректы не менять
- Яндекс.Метрика: 113000419
- Google Search Console: существующее подтверждение не менять; отдельного Google Analytics/gtag в исходном production index.html нет
- телефон: +7 908 899-00-88
- WhatsApp, Telegram, MAX, email — текущие реальные ссылки проекта

## Сборка
```
npm ci
npm run build:production
npm run qa:production
```

Готовое содержимое для корня сайта находится в `dist/`.

## Перед заменой файлов на сервере
1. Сделать архив текущего корня сайта на сервере.
2. Не менять DNS, SSL и существующую конфигурацию редиректов.
3. Заменять только файлы сайта содержимым `dist/`.

## После выкладки
Проверить:
- https://evsavelev.ru/
- https://evsavelev.ru/projects/
- https://evsavelev.ru/robots.txt
- https://evsavelev.ru/sitemap.xml
- телефон и все мессенджеры
- форму заявки
- цены со скидкой 50% до 31.12.2026
- Яндекс.Метрику 113000419
- отсутствие ошибок в консоли
- mobile 360/390/430 и desktop 1440

После успешной проверки отправить sitemap в Google Search Console и Яндекс Вебмастер / запросить переобход главной и /projects/.
