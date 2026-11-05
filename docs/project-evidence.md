# Project evidence and visual provenance

Research date: 5 November 2026. Only the portfolio repository was changed for publication. Project repositories were read from these snapshots:

- TaskBoard: `sagar-varshney/TaskBoard-Project-Management`, commit `4681082f4cf9cde0dbeec6e0dddfa58ab36122a0`.
- BriefActions: `sagar-varshney/BriefActions`, commit `f82ff4f5a55f00803602f1dbc50bb3777a6fe3dc`.

## TaskBoard

Sources: README; `frontend/package.json`; `database/schema.sql`; eight files in `database/migrations`; `src/services/agent.service.js`; authentication and role middleware.

The schema contains 12 tables, with admin/developer/member roles. The agent exposes nine application tools, excluding its `answer` fallback. More than 40 API operations is a conservative capability count; legacy `/issues` aliases should not be counted as new product operations. Tools forward the user's authorization through application API calls, reusing backend account/role checks.

The repository contains no product screenshots or reusable demo login. Portfolio captures use its actual Next.js frontend, running against an isolated local fixture API with fictional sample data. This is visual evidence of the source interface, not a claim that the fixture API verifies production backend behavior. No production account or workspace data was created or used. The screenshot caption identifies a local sample workspace.

## BriefActions

Sources: README; `docs/development.md`; `docs/performance.md`; `docs/release-check.md`; `server/index.mjs`; `flow_engine.py`; `CHANGELOG.md`.

The active product is a React/Vite frontend, Node API and Python extraction/history system. SQLite is available locally, with PostgreSQL and Supabase Auth hosted. Ordinary extraction is rule-based; TF-IDF summaries, K-Means grouping and Logistic Regression suggestions are downstream helpers. Proposed tasks retain source passages, unstated details remain Unknown, and users review and confirm tasks before they enter a plan. Calendar, progress and versioned corrections support follow-through.

The public demo URL is documented at `https://briefactions.onrender.com/#product-demo`.

The 1,349 ms to 9 ms analysis figure is explicitly a documented **warm local synthetic diagnostic**, excluding the first workflow from each median. The first reused-worker analysis took 1,253 ms. It isolates interpreter/import overhead, not hosted latency or real-meeting accuracy. The portfolio includes those caveats beside the metric.

Three screenshots were copied unchanged from `docs/screenshots/review-dark.png`, `task-details-dark.png` and `calendar-dark.png`. They show an invented example meeting and disposable demo-account fixture; their provenance is documented in `docs/release-check.md`. They are labeled accordingly in the portfolio. No private user information is shown.

## Scope

No user adoption, real-world productivity impact, production latency, or new test-coverage claims are made. The project suites were not rerun as part of this portfolio edit. Portfolio validation covers its own assets, links, scene controls, dialogs, keyboard behavior and responsive presentation.

## Product presentation update

The TaskBoard walkthrough adds captures of the create-ticket form and a ticket-detail screen from the same unchanged frontend and isolated fictional fixture workspace. Form values are illustrative and were not submitted. Screenshots demonstrate the interface, not production backend validation.

BriefActions uses its original three screenshots in a guided review → task details → calendar walkthrough. Full-size source images remain available from every step.

BriefActions’ blue ribbon mark is copied from its `web/public/flow.svg`. TaskBoard’s source contains only a text “TB” brand, so the portfolio uses a newly drawn board/ticket pictogram. See `dist/assets/logos/PROVENANCE.txt` for exact sources. The project repositories and their actual branding were not changed.

The sharing card is original SVG artwork rasterized to a 1200×630 JPEG; its source is retained as `dist/assets/social-preview-source.svg`.
