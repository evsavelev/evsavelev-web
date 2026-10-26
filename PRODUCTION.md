# evsavelev.ru — GitHub Pages production

## Source of truth and deployment
- Public repo: https://github.com/evsavelev/evsavelev-web
- Production domain: https://evsavelev.ru/
- Published site: GitHub Actions workflow `.github/workflows/pages.yml` on pushes to `main`.
- Publication uses `npm ci` → `npm run build:production` → `npm run qa:production` → build noindex design demos → upload `dist/` → `deploy-pages`.
- Do **not** publish with plain `npm run build`: it intentionally omits Yandex Metrika.
- GitHub Pages custom domain `evsavelev.ru` is configured in repository Settings → Pages.
- DNS is managed at REG.RU, independently from its paid hosting.

## DNS required at REG.RU
- Nameservers: ns1.reg.ru and ns2.reg.ru.
- Apex A (`@`): 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153.
- CNAME `www` → evsavelev.github.io.
- No older hosting A or AAAA records should remain in **active** zone.
- Retain/recreate existing Google Search Console domain TXT verification and other verified domain TXT records before final DNS cutover; they are DNS records, not GitHub files.
- Enable Enforce HTTPS after GitHub verifies DNS and issues a certificate.

## Production invariants
- Correct canonical, Open Graph and Schema.org URLs use https://evsavelev.ru/.
- Yandex Metrika counter 113000419 (once per page) included by `PRODUCTION=1`.
- `robots.txt` and `sitemap.xml` produced by `scripts/build.cjs` use evsavelev.ru and include / and /projects/.
- The projects page is served at /projects/.
- Contacts: +7 908 899-00-88; WhatsApp / Telegram / MAX / email as in source.
- Request form only prepares a message; it does not send to a backend.
- Offer/pricing text is kept as reviewed in this branch; do not silently change it during a hosting move.

## Test locally
```sh
npm ci
npm run build:production
npm run qa:production
```

For visual QA run the existing responsive Playwright suite as documented in the repository.

## Safe release and rollback
1. Create a branch/checkpoint before changes to main.
2. Open PR and require production QA before merge.
3. Merge after testing; GitHub Actions deploys automatically.
4. Check Pages workflow conclusion and open https://evsavelev.ru/ and /projects/ once DNS has propagated.
5. Roll back with revert of the merge commit if needed, never force-push.
6. After DNS is active, recheck HTTPS, Google Search Console and Yandex Webmaster verification, sitemap crawling and Metrika dashboard.

Note: until delegation propagates publicly, HTTPS and the custom-domain health check can fail despite correct new REG.RU zone entries.
