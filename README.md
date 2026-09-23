# RDevX 2026 Prototypes

One static GitHub Pages repository containing three functional prototypes:

- **Gateway** — AI-Powered Level 1 Candidate Screening
- **Horizon** — Engagement Governance
- **Sentinel** — Delivery Risk Governance

## Repository structure

```text
rdevx-2026-prototypes/
├── index.html
├── gateway/
├── horizon/
└── sentinel/
```

Each project contains its own `index.html`, `screens/`, `journeys/`, `assets/styles.css`, `assets/app.js` and `README.md`.

## Open locally

Double-click the top-level `index.html`, or serve the folder with any static server:

```bash
python -m http.server 8000
```

## Publish with GitHub Pages

1. Create a repository named `rdevx-2026-prototypes`.
2. Copy the contents of this folder into the repository root.
3. Commit and push to `main`.
4. Open **Settings → Pages**.
5. Choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
6. Save and open the published root page.

The implementation uses plain HTML, local CSS and vanilla JavaScript. There are no external dependencies, CDNs, network calls, build steps or backend services.
