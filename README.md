# Sagar Varshney — Portfolio

My personal portfolio showcasing full-stack applications, applied AI, and the engineering decisions behind my projects.

**[Explore the live portfolio](https://sagar-varshney-portfolio.onrender.com/)**

## Featured projects

### TaskBoard

A shared workspace for projects, sprints, tickets, and attachments, with a LangGraph assistant that uses the application's authenticated APIs.

Built with **Next.js, React, Express, MySQL, and LangGraph**.

[Live application](https://taskboard-frontend-ochre.vercel.app/) · [Source code](https://github.com/sagar-varshney/TaskBoard-Project-Management)

### BriefActions

Turn meeting transcripts into action plans you can review and track. Suggested tasks retain their supporting transcript passages, and users review owners, deadlines, and tasks before saving a plan.

Built with **Python, React, Node.js, PostgreSQL, and Supabase Auth**.

[Try the public demo](https://briefactions.onrender.com/#product-demo) · [Source code](https://github.com/sagar-varshney/BriefActions)

## The portfolio experience

- An original Three.js orbital sculpture with drag controls, project-specific core marks, accent colors, and screenshot previews.
- Real project screenshots and case studies covering the problem, implementation, engineering choices, and results.
- A browsable toolkit with Python selected first.
- Responsive layouts, mobile navigation, keyboard-accessible dialogs, reduced-motion support, and a motion toggle.
- Self-hosted fonts and Three.js modules, plus a CSS fallback when WebGL is unavailable.

Project claims and screenshot provenance are recorded in [the evidence notes](docs/project-evidence.md). TaskBoard captures show its actual frontend with fictional local sample data; BriefActions captures show an invented example meeting.

## Run locally

The site uses plain HTML, CSS, and JavaScript. No dependency installation or build step is required.

From the repository root, run:

```sh
python3 -m http.server 4173 --directory dist
```

Then open [localhost:4173](http://localhost:4173/).

## Source structure

| Path | Purpose |
| --- | --- |
| `dist/index.html` | Page content, layout, project captures, and fallback sculpture |
| `dist/style.css` | Typography, responsive layouts, and visual styling |
| `dist/script.js` | Case studies, navigation, toolkit, and scene controls |
| `dist/orbit.js` | Three.js sculpture, procedural terrain, and scene interactions |
| `dist/assets/projects/` | Project interface screenshots |
| `dist/assets/fonts/` | Instrument Serif Italic and its SIL Open Font License |
| `dist/assets/vendor/` | Three.js modules and MIT license |
| `docs/project-evidence.md` | Source snapshots, benchmark context, and screenshot provenance |

## Next update

Planned refinements, not yet implemented:

- Replace the hero's TB and BA initials with the actual app logos and readable product names.
- Introduce each project through what it helps people accomplish, with clearer invitations to explore the work and get in touch.

Ideas for consideration include a shorter mobile hero, simplified project navigation, brief product walkthroughs, larger supporting text, and a custom social-sharing preview.

## Hosting

The portfolio is hosted as a **Render Static Site** with these settings:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Build command | `test -f dist/index.html` |
| Publish directory | `dist` |

No application server, database, or runtime secrets are required for the portfolio. The current public-repository connection requires a manual Render deployment after site changes are pushed. Verify that the intended commit becomes `live` before reporting publication. Documentation-only changes do not require a site deployment.

The `.openai/hosting.json` file records an earlier Sites deployment; Render serves only `dist/`.

## Content maintenance

Certifications and the résumé download are currently removed. Render redirects the retired `/assets/sagar-varshney-resume.pdf` URL to `/` to prevent access to the old cached PDF. When an updated résumé is ready, publish it under a new filename and restore the download link; retain the redirect for the retired URL.
