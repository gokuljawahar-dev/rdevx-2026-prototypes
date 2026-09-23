# RDevX 2026 Purpose-Built Prototypes — QA Report

**Validation date:** 2026-09-23  
**Repository:** `rdevx-2026-prototypes`

## Build inventory

| Product | Instruments | Guided journeys | Product design language |
|---|---:|---:|---|
| Gateway | 6 | 4 | Calm, candidate-first guided flow with a persistent dignity/progress rail |
| Horizon | 8 | 4 | Dense, exception-first executive command cockpit with lever scorecards |
| Sentinel | 9 | 5 | High-contrast risk operations center with worst-first signals and evidence timelines |
| **Total** | **23** | **13** | Three independent CSS/JavaScript systems within one static repository |

The repository contains **40 HTML pages**: one shared landing page, three product landings, 23 instrument pages and 13 journey pages. Including documentation and assets, the packaged repository contains **51 files**.

## Automated static validation

All 40 HTML pages were parsed and checked.

- **Missing local links/assets:** 0
- **External URLs, CDNs, web fonts or network dependencies:** 0
- **Root-absolute paths:** 0
- **Duplicate HTML IDs:** 0
- **JavaScript syntax errors (`node --check`):** 0
- **Instrument pages without all four states (Empty, Loading, Error/Unknown, Success):** 0
- **Instrument pages without the five-stage IDS ribbon:** 0
- **Instrument pages without a lever mapping:** 0
- **Instrument pages without an explicit system-versus-human authority boundary:** 0
- **Journey pages without six steps and working step controls:** 0
- **Horizon/Sentinel pages without a density control:** 0

## Distinct asset verification

Each product owns a separate stylesheet and interaction script. SHA-256 hashes are intentionally different:

| Product | `styles.css` SHA-256 | `app.js` SHA-256 |
|---|---|---|
| Gateway | `9d595fd824d300c99fa49a9b5b40d8af066636c45eb1097c31ab41e1d04d9d94` | `3782f0c893125f1f3022337f3d86223d086b8ebd5693742e22b94dd5bcc19edd` |
| Horizon | `89908696f1094121f848e7c2064b622b34d2b83d440fdda1cce11b278666c428` | `0901b687e2ac649e819c671d599688802d3343d39f6f5166881271b72397764d` |
| Sentinel | `c5b714a8cace33d59f2fb2e94c90ad544c61be61f17a13eb1e573eb630417fd1` | `c926758629383101f91cb757e479f7a8d9ed22cb7987071ec2936544e8414b3f` |

## Representative interaction smoke tests

A headless Chromium smoke test exercised representative pages and passed all checks:

- Gateway: consent toggles, consent commit, toast feedback, sidebar collapse, focus mode and four-state switching.
- Horizon: compact-density toggle, ranked-operation selection and four-state switching.
- Sentinel: signal selection, context-panel collapse and four-state switching.
- Cross-product: six-step journey progression and lever-based instrument filtering.

The workspace preferences use `localStorage` when available and degrade safely when storage access is restricted.

## Visual QA

Ten representative pages were rendered at 1600 × 1000 and inspected:

- Shared landing
- Gateway landing, I-04 Consent and J3 readiness-recovery journey
- Horizon landing, I-02 Lever Scorecards and I-06 Sprint-Risk Recovery
- Sentinel landing, I-02 Risk Signal Inbox and I-08 Customer Escalation Approval Packet

The representative renders confirm three visibly different product archetypes, readable hierarchy, complete navigation, usable context panels, visible IDS placement and explicit named-human authority boundaries.

## Packaging verification

The final ZIP is built from the repository root folder so it extracts as:

```text
rdevx-2026-prototypes/
  index.html
  gateway/
  horizon/
  sentinel/
```

No build step, package manager, server, framework, CDN, remote font or network request is required.
