# Horizon — Engagement Governance

Functional, self-contained static prototype derived from the RDevX 2026 wireframes.

## What is included

- `I-01` — Portfolio Attention Queue
- `I-02` — Engagement Overview + Lever Scorecards
- `I-03` — Signal Evidence Drawer
- `I-04` — Decision & Action Register
- `I-05` — Scope Change Simulation & Approval Packet
- `I-06` — Sprint-Risk Recovery & Blocker Escalation
- `I-07` — Release Readiness Decision Packet
- `I-08` — Quality Action & Outcome Closure

### Guided journeys

- `J1` — At Risk portfolio item
- `J2` — Sprint blocker deep link
- `J3` — Scope change approval
- `J4` — Unknown evidence or unresolved authority

## Run locally

No server or build step is required. Open `index.html` directly in a browser. A local static server is optional:

```bash
python -m http.server 8000
```

Then open the repository root at `http://localhost:8000/`.

## GitHub Pages — one repo, three project folders

1. Create or reuse a repository named `rdevx-2026-prototypes`.
2. Place the top-level `index.html` at the repository root and keep `gateway/`, `horizon/` and `sentinel/` as sibling folders.
3. Commit and push to `main`.
4. In **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then save.
5. The shared landing page is published from the repository root. This project is available under `/horizon/`.
6. Click through every screen and journey to confirm the relative links resolve correctly.

## Implementation notes

- Plain semantic HTML, local CSS and vanilla JavaScript only.
- No external fonts, frameworks, CDNs, network calls or backend.
- All paths are relative and compatible with a project subfolder on GitHub Pages.
- Empty, Loading, Error / Unknown and Success states are switchable on instrument screens.
- Interactive state is stored in `localStorage` only and can be cleared from browser site data.
- The prototype uses illustrative data consistent with the supplied wireframes; it does not contain production data.
