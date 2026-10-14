# The Unlikely Zionists

Public source repository for the cinematic storytelling and community project, currently in development. **This is not a live private story intake service.**

## What is committed

- `index.html` — corrected accessible cinematic interface, WebGL2 scene code, motion fallback, swipeable empty story placeholders and an animated *draft* story form.
- `preview.html` — separately accessible preview.
- `admin.html` — a development editorial-review UI, not deployed to GitHub Pages.
- `.github/workflows/deploy-pages.yml` — public site deployment configuration that intentionally publishes ONLY `index.html` and `preview.html`.
- `docs/PRIVATE_INTAKE_DEPLOYMENT.md` — strict private-data, security, consent and hosting requirements.
- `requirements.txt`, `run.sh`, `.gitignore`, `.env.example` — preparation for the separate development backend.

## Current constraints

The full tested development server source is in the owner's downloadable complete source archive, **not yet committed to this public repository**. No actual private submissions are being collected here. GitHub Pages cannot run Python, secure a persistent SQLite database, or host confidential photographs.

The public GitHub Pages workflow has not succeeded yet because the repository's Pages site is not enabled and the workflow token cannot enable it. Repository owner: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Once enabled, the workflow can rerun.

Never publish a real person's photograph or testimony without specific prior consent. Do not treat material gathered for The October Turn as permission for this site.

The selected palette is Glacier `#A7F3EF`, Ruby `#9E003C`, and White `#FFFFFF`. The centered homepage phrase is **“WELL, THIS IS UNEXPECTED.”** No fictional participants, portraits, or biographies are included.

Animations and normal fallback interaction have been tested in prior local builds. The actual GPU-rendered WebGL effects have **not** been fully certified in a hardware-enabled browser. Four development API tests have passed locally; the public site still needs production QA and a separate secure submissions host.
