# Sentinel — Delivery Risk Governance

## Product intent

Maintain a continuously refreshed, evidence-backed view of delivery exposure so every material emerging risk is identified early, prioritized, assigned, acted upon and either mitigated, accepted, escalated with human approval or safely blocked before avoidable harm occurs.

## Design language for Sentinel

- **Layout archetype:** Continuous risk operations center: worst-first signal inbox, governed lifecycle workbench, evidence provenance timeline and authority-bound escalation.
- **Typography:** Precise system typography with monospace IDs, versions and timestamps; compact labels distinguish facts, predictions and decisions.
- **Color and surface:** Near-black operations surfaces with cyan evidence, indigo control, red critical, amber watch and steel Unknown; contrast communicates severity and freshness.
- **Spacing and density:** A dense 4/6/10/16px operating rhythm, narrow gutters and a comfortable/compact density toggle for live data.
- **Signature component:** Evidence-provenance timeline + worst-first severity aggregator, with every consequential effect visibly gated by named authority.
- **Screen-space controls:** Persistent sidebar collapse ([), focus mode (F), evidence-panel toggle, density toggle (D), live clock and remembered settings.

## Governance levers

- **L01 — Risk Pattern Detection & Prediction:** Qualify explainable patterns and provisional delivery-risk candidates with provenance and uncertainty.
- **L02 — Integrated Risk Lifecycle Management:** Govern candidate, risk, issue, escalation, resolution and closure through explicit state and authority.
- **L03 — Proactive Alerts & Notifications:** Route accountable notifications with delivery, acknowledgement, deduplication and escalation evidence.
- **L04 — Root Cause Analysis Management:** Separate facts, hypotheses, human validation, CAPA and effectiveness before learning.
- **L05 — Action & Commitment Management:** Convert decisions into owned work with dependencies, evidence rules and measured outcome closure.

## Instruments

- **I-01 — Portfolio Risk Cockpit:** Portfolio exposure, freshness and governed next operation in one worst-first view.
- **I-02 — Risk Signal Inbox:** Provisional candidates, evidence quality, alternatives and bounded triage stay distinct.
- **I-03 — Risk Lifecycle Workbench:** Connected lifecycle, evidence history and only permissible governed transitions.
- **I-04 — Alert Center:** Delivery, acknowledgement, suppression and escalation become auditable response paths.
- **I-05 — RCA Workspace:** Observed facts, hypotheses, human validation, CAPA and effectiveness remain visibly distinct.
- **I-06 — Action & Commitment Tracker:** Ownership, dependencies, evidence and verified closure prevent orphan work.
- **I-07 — Conversational Assistant:** Cited explanation and drafting reduce retrieval effort without state or execution authority.
- **I-08 — Customer Escalation Approval Packet:** Exact recipients, payload, confidentiality, scope, expiry and named approval precede external effect.
- **I-09 — Outcome & Learning Closure:** Baseline, target, observation window and evidence quality govern closure and learning.

## Guided journeys

- **J1 — Emerging risk before escalation:** Fresh signals become governed action only after evidence, alternatives and authority are explicit.
- **J2 — Existing risk with overdue mitigation:** The current state is resumed without rebuilding history or duplicating work.
- **J3 — Qualifying incident requiring RCA:** Facts, hypotheses, validation, CAPA and effectiveness remain visibly distinct.
- **J4 — Potential customer escalation:** The exact payload stays internal until named authority approves it.
- **J5 — Broken state: authority and evidence:** Unknown evidence and unresolved authority force a safe blocked state.

## IDS loop

Every screen exposes **Intent → Context + Signals → Decision → Action → Outcome**. The current stage is highlighted, lever links are navigable, and decision/action screens explicitly separate what the system proposes or enforces from where named-human authority acts.

## Keyboard and workspace controls

- `[` collapses or expands the persistent navigation rail.
- `F` toggles focus mode and reclaims the context-panel area.
- `D` toggles comfortable/compact density on data-heavy products.
- `Escape` closes navigation, drawers and modals.
- Choices are remembered in `localStorage` per product.

## Run locally

Open `index.html` directly. No server, package manager, build step, CDN, web font or network request is required.

## Publish on GitHub Pages

1. Place this folder at `rdevx-2026-prototypes/sentinel/` and keep the repo-root `index.html` beside the three project folders.
2. Commit and push to `main`.
3. In GitHub: **Settings → Pages → Deploy from a branch → main → / (root)**.
4. Open `https://<user>.github.io/rdevx-2026-prototypes/sentinel/` and verify the relative links.
