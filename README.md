# Sagar Varshney — portfolio

Live portfolio: https://sagar-varshney-portfolio.onrender.com

A responsive, buildless portfolio in `dist/`, combining a full-bleed cinematic orbital hero, expressive type, and technical project presentation. The visual direction brings together Hamol Studio's immersive 3D, Andreas Vision's expressive typography and playful interaction, and Kshitij Betwal's dark technical atmosphere, using original scene geometry, artwork, and Sagar's own content.

The original SIGNAL CORE scene includes a faceted project lens, fractured chrome orbits, satellites, a procedural planetary horizon, and stars. Visitors can drag it, rotate through featured projects, change the accent, reset rotation, and pause motion. The toolkit is manually browsable with Python selected first. Selecting a featured project changes the core initials, project accent, and real interface thumbnail. The hero foregrounds Sagar’s name and role.

Projects: TaskBoard and BriefActions. Project content is verified against the GitHub source snapshots documented in `docs/project-evidence.md`. Actual interface screenshots use clearly labeled sample workspaces or invented example meetings. BriefActions links to https://github.com/sagar-varshney/BriefActions. The résumé download and served PDF are removed until an updated document is provided. Certifications are also removed.

## Preview

Serve `dist/` with a static HTTP server, e.g. `python3 -m http.server 4173 --directory dist`.

## Editing

- `dist/index.html`: content, layout, project captures, and fallback sculpture
- `dist/style.css`: typography, colors, responsive layout, and interactions
- `dist/script.js`: case studies, filters, navigation, manual toolkit selection, featured-project controls, and motion/color controls
- `dist/orbit.js`: original procedural Three.js orbital sculpture, planet, and interactions
- `dist/assets/vendor/`: self-hosted Three.js 0.180.0 modules and MIT license
- `dist/assets/fonts/`: self-hosted Instrument Serif Italic and its SIL Open Font License
- `dist/assets/projects/`: actual project-interface captures
- `docs/project-evidence.md`: source snapshots, claims, benchmark conditions, and screenshot provenance

System fonts and self-hosted runtime assets keep the page independent of third-party font or CDN requests. The scene has a CSS fallback when WebGL fails and supports reduced motion and a pause control. Dialogs support keyboard dismissal and focus restoration.

## Render hosting

This repository is deployed as a Static Site: branch `main`, publish directory `dist`, build command `test -f dist/index.html`. No server, database, or runtime secrets are needed. The current public-repository connection requires manually triggering a deployment after pushing source updates; verify that the deployed commit becomes `live` before reporting publication.

The `.openai/hosting.json` file records an earlier Sites deployment; Render serves only `dist/` and does not use that file.

### Retired résumé URL

Render's Redirects/Rewrites settings contain an exact-path redirect from `/assets/sagar-varshney-resume.pdf` to `/`. This prevents the old cached PDF download from remaining accessible after removal. When a revised résumé is supplied, publish it under a new filename and restore the portfolio links; the retired URL can remain redirected.
