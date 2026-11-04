# Sagar Varshney — portfolio

Live portfolio: https://sagar-varshney-portfolio.onrender.com

A responsive, buildless portfolio in `dist/`. The studio design uses warm paper colors, original project illustrations, a procedural connected-systems sculpture, and a browsable toolkit with Python first. The visual direction takes cues from the expressive typography and sculptural interactions of Andreas Vision and Hamol Studio, with original composition, artwork, and Sagar's own content.

Projects: TaskBoard and BriefActions. Project content is based on the supplied résumé and user corrections; product mockups are explicitly labeled as illustrations. BriefActions links to https://github.com/sagar-varshney/BriefActions. The résumé download and served PDF are removed until an updated document is provided.

## Preview

Serve `dist/` with a static HTTP server, e.g. `python3 -m http.server 4173 --directory dist`.

## Editing

- `dist/index.html`: content, layout, project illustrations, and fallback sculpture
- `dist/style.css`: typography, colors, responsive layout, and interactions
- `dist/script.js`: case studies, filters, navigation, manual toolkit selection, and motion controls
- `dist/workbench.js`: original procedural Three.js sculpture
- `dist/assets/vendor/`: self-hosted Three.js 0.180.0 modules and MIT license

System fonts and self-hosted runtime assets keep the page independent of third-party font or CDN requests. The sculpture has an SVG fallback when WebGL fails and supports reduced motion and a pause control. Dialogs support keyboard dismissal and focus restoration.

## Render hosting

This repository is deployed as a Static Site: branch `main`, publish directory `dist`, build command `test -f dist/index.html`. No server, database, or runtime secrets are needed. The current public-repository connection requires manually triggering a deployment after pushing source updates; verify that the deployed commit becomes `live` before reporting publication.

The `.openai/hosting.json` file records an earlier Sites deployment; Render serves only `dist/` and does not use that file.
