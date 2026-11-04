# Sagar Varshney — portfolio

A buildless, responsive portfolio in `dist/`. All biographical content is based on the résumé supplied on 4 November 2026. Project illustrations are explicitly labeled as conceptual, rather than product screenshots. External project links are copied from the résumé; their availability has not been verified.

## Preview

Serve `dist/` with any static HTTP server, for example `python3 -m http.server 4173 --directory dist`.

## Editing

- `dist/index.html`: portfolio content and project illustrations
- `dist/style.css`: colors, typography, layout, and responsive styles
- `dist/script.js`: project case studies and filtering
- `dist/assets/sagar-varshney-resume.pdf`: supplied résumé
- `.openai/hosting.json`: Sites identity and hosting configuration

The site uses system fonts and has no external runtime dependencies. Navigation works without JavaScript; project dialogs and filters require JavaScript. It includes reduced-motion support, visible focus states, a skip link, and native keyboard-accessible dialogs.
