# Motion v3 — Kinetic Editorial

Autonomous comparison route: `/motion-v3/`. Source contract: `../docs/motion-v3/`.
Branch: `feat/motion-v3`. Checkpoint: `08ffc1d7ccf9d4df1b3846438b8e4aa2ea4c8964`.

Build in order:

```sh
node scripts/build.cjs
node stitch-v2/build.cjs
node motion-v3/build.cjs
```

Serve with the repository server (`PORT=4203`) and open
`http://127.0.0.1:4203/evsavelev-web/motion-v3/index.html`.
The existing local server requires the explicit `index.html`; Pages supports the directory URL.

QA (requires the repository's Playwright dependency and installed Chrome):

```sh
node scripts/qa-motion-v3.cjs
node scripts/qa-motion-v3-review.cjs
node scripts/qa-motion-v3-accessibility.cjs
node scripts/qa-motion-v3-hero.cjs
node scripts/qa-motion-v3-sites.cjs
```

`QA_URL` overrides the Motion v3 target, including production; `SITES_URL` sets the
Main/Stitch root for the existing-sites smoke test. The accessibility script accepts
`AXE_PATH` pointing to an installed `axe-core/axe.min.js`. No runtime dependency is
added to the site. Screenshots and raw diagnostics are in `qa/motion-v3/`; committed
reports are in `verification/motion-v3/`.

Protection: all existing tracked source files are compared against the checkpoint.
Only `.github/workflows/pages.yml` changes, with one additive build command.
`verify-motion-v3-protection.cjs` compares the current published Main/Stitch HTML,
CSS, JS and sitemap against SHA-256 values captured before publication.

Rollback of the route: revert the feature commit and its additive workflow step;
do not reset any existing worktree or user's files.
