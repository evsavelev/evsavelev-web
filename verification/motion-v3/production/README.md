# Production acceptance — 2026-09-21

PR #1 merged as `243bee55266cf08b2dc85f67cd4f53612462401b`.
GitHub Pages deployment succeeded: https://github.com/evsavelev/evsavelev-web/actions/runs/35595308310

Live versions:
- https://evsavelev.github.io/evsavelev-web/
- https://evsavelev.github.io/evsavelev-web/stitch-v2/
- https://evsavelev.github.io/evsavelev-web/motion-v3/

Chrome production checks passed at 360, 390, 430, 768, 1024, 1440 and 1920 px:
full scroll, assets, navigation, forms, contacts, responsive scene and seven process stages.
No console/page errors or horizontal overflow. Keyboard, no-JS and reduced-motion
desktop/mobile checks passed. Forms prepare messages; no real messages were sent.

Hero checked at twelve timestamps on all seven widths, with screenshots visually reviewed.
Completion jump: 0 px. Native real-time centre drift below 0.01 px.
Runtime reduced-motion toggling passed. Frame sample: median 16.7 ms, p95 16.8 ms,
zero frames over 50 ms. These are desktop Chrome laboratory measurements, not field data.
LCP 372–732 ms; maximum measured CLS 0.09536. Axe: zero tested WCAG A/AA violations.

Main and Stitch v2 passed desktop/mobile navigation, contact and form smoke checks.
All eight saved SHA-256 hashes (Main/Stitch HTML, CSS, JS and sitemap) match the
pre-publication baseline byte for byte; see protection.json. All original tracked
source files were also verified unchanged before merge, except the additive Pages
build step for Motion v3. User working-copy changes were preserved.

JSON reports and representative production Hero frames accompany this report.
Full screenshots remain in qa/motion-v3/production in the local worktree.
