# Sagar Varshney — portfolio

Live portfolio: https://sagar-varshney-portfolio.onrender.com

A buildless, responsive portfolio in `dist/`, with a dark starfield, an original procedural 3D robot, and an interactive technology showcase. The design takes inspiration from the visual direction of Kshitij Betwal's portfolio while retaining Sagar's content and original artwork. All biographical content is based on the résumé supplied on 4 November 2026. Project illustrations are explicitly labeled as conceptual. External project links are copied from the résumé; their availability has not been verified.

## Preview

Serve `dist/` with any static HTTP server, for example `python3 -m http.server 4173 --directory dist`.

## Editing

- `dist/index.html`: portfolio content and project illustrations
- `dist/style.css`: colors, typography, layout, and responsive styles
- `dist/script.js`: case studies, filtering, navigation, motion controls, starfield, and technology carousel
- `dist/robot.js`: original procedural Three.js robot and interaction
- `dist/assets/vendor/`: self-hosted Three.js 0.180.0 modules and MIT license
- `dist/assets/sagar-varshney-resume.pdf`: supplied résumé
- `.openai/hosting.json`: Sites identity and hosting configuration

The site uses system fonts, with all runtime assets hosted locally. Navigation and content remain available without JavaScript; the robot falls back to an original SVG illustration if WebGL fails. It includes reduced-motion support, a global animation pause control, visible focus states, a skip link, and native keyboard-accessible dialogs.

## Render hosting

Deploy this repository as a **Static Site** with branch `main`, publish directory `dist`, and build command `test -f dist/index.html`. No package installation, application server, database, or runtime secrets are required. Enable automatic deployment on commits to `main`.

The `.openai/hosting.json` file records the earlier Sites deployment; Render serves only `dist/` and does not use that file.
