# Reference lock and implementation decisions

Build target: the six documents in `docs/motion-v3/`, baseline commit
`08ffc1d7ccf9d4df1b3846438b8e4aa2ea4c8964`. `DESIGN.md` here is an exact copy
of the supplied design contract. No changes to the root design system.

Refero-free catalog research: 2026-09-21, 900 light styles available. Facets,
three searches and three full design systems read. The catalog loaded successfully.

| Direction studied | Evidence | Use / rejection |
| --- | --- | --- |
| Editorial gallery | https://dashdigital.studio | Large real work, restrained surfaces; reject light display weight and pill CTAs because the supplied contract specifies Inter 650–750 and 4px buttons. |
| Kinetic typography | https://studio.design | Primary supporting reference: large Inter, uninterrupted canvas, artwork retains its own colors. Reject overlapping collage: the build canvas must explain one continuous process. |
| Quiet independent studio | https://websmith.studio | Spacing and pauses between commercial sections. Reject pastel service cards and green status accents. |

Primary authority remains Kinetic Editorial from the user's DESIGN/MOTION/STORYBOARD.
Preserve #F2F0EA, #111111, #FF4D24, local Inter, 12-column proportions, thin lines,
4px controls, real screenshots. Accent belongs to CTA, active state and progress.
The demo section is the expressly specified exception: full vermilion background.

| Decision | Source | Reason |
| --- | --- | --- |
| Immediately readable H1 and CTA | MASTER steps 5/12, QA initial-state acceptance | Takes priority over the conflicting delayed H1/CTA animation in MOTION §7. |
| Reuse one DOM interface for Process | MOTION §11, STORYBOARD 7–12 | Notes, wireframe, design and breakpoint annotations transform the same elements. |
| Own-site miniature with real project image | DESIGN §19 | No invented client product or fake dashboard. |
| Seven compact mobile scenes | DESIGN §23 | No long sticky sequence below 1024px. |
| Discrete responsive widths | MOTION §3 and §13 | Real layout changes without continuous width recalculation on every scroll tick. |
| All ten portfolio entries | data/projects.json | Real names, tasks, links and ordering remain authoritative. |
| Message preparation only | existing Stitch contact behavior / MASTER §11 | No backend send or false success. |
| Native details, anchors and static stage content | QA accessibility/no-JS | Essential content does not depend on animation. |

Architecture: static HTML generated at build, isolated CSS, independently disposable
hero/process/portfolio/responsive scenes, native scrolling and no animation dependencies.
Images and fonts reuse existing read-only assets via relative URLs. No generated imagery.
