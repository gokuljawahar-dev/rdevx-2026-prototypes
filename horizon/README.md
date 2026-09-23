# Horizon — Engagement Governance

## Product intent

Enable an Engagement Manager to detect the most material objective gap early, understand trusted evidence, take the next permissible governed action and verify whether it improved the outcome.

## Design language for Horizon

- **Layout archetype:** Dense executive command cockpit: exception-first attention, six-lever diagnosis, evidence drill-down and governed action.
- **Typography:** Tighter executive system typography with compact headings, tabular figures and a controlled uppercase label layer.
- **Color and surface:** Deep ink and midnight surfaces, turquoise evidence, muted gold authority, coral exception and gray-blue Unknown; elevation is expressed with rules, not floating cards.
- **Spacing and density:** A disciplined 4/8/12/20px grid with compact tables and a user-controlled comfortable/compact density mode.
- **Signature component:** Exception Priority Queue + six independent lever scorecards: one objective gap is visible without blending away hard gates.
- **Screen-space controls:** Persistent sidebar collapse ([), focus mode (F), right evidence-panel toggle, density toggle (D) and remembered settings.

## Governance levers

- **L01 — Requirements & Scope Governance:** Version approved baselines, traceability, prioritization and controlled change.
- **L02 — Work Breakdown, Estimation & Capacity Planning:** Reconcile estimable work, demand, skills, dependencies and available capacity before commitment.
- **L03 — Backlog & Work Management:** Maintain execution-ready work, ownership, Definition of Ready, WIP, blockers and aging.
- **L04 — Sprint Planning & Execution:** Govern capacity-based commitments, sprint-goal progress and blocker recovery.
- **L05 — Release Planning & Governance:** Coordinate release scope, milestones, dependencies, readiness gates and named decision authority.
- **L06 — Quality & Continuous Improvement:** Bind threshold breaches to owned action, accepted outcome evidence and sustained improvement.

## Instruments

- **I-01 — Portfolio Attention Queue:** Exception-first deterministic ranking with a one-line why-now explanation.
- **I-02 — Engagement Overview + Lever Scorecards:** One controlled state with six independent lever scorecards and no blended health score.
- **I-03 — Signal Evidence Drawer:** Observed facts, prediction, policy, alternatives and authority form one inspectable evidence chain.
- **I-04 — Decision & Action Register:** Owner, approver, expiry, state transition, escalation and closure evidence are explicit.
- **I-05 — Scope Change Simulation & Approval Packet:** Side-effect-free projection exposes cross-lever consequences before authority is exercised.
- **I-06 — Sprint-Risk Recovery & Blocker Escalation:** Only permissible recovery operations appear, with prerequisites and approval needs.
- **I-07 — Release Readiness Decision Packet:** Pass, Fail and Unknown gates constrain Go, No-Go, Defer or Conditional choices.
- **I-08 — Quality Action & Outcome Closure:** Task state, post-action measure, sustained window and Verify/Reopen stay distinct.

## Guided journeys

- **J1 — At Risk portfolio item:** Exception-first orientation moves an Engagement Manager from material risk to verified outcome.
- **J2 — Sprint blocker deep link:** Typed state restores context and prevents duplicate recovery work.
- **J3 — Scope change approval:** A frozen packet exposes cross-lever consequences before authority is exercised.
- **J4 — Unknown evidence or unresolved authority:** The system holds a visible safe state until evidence and named authority recover.

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

1. Place this folder at `rdevx-2026-prototypes/horizon/` and keep the repo-root `index.html` beside the three project folders.
2. Commit and push to `main`.
3. In GitHub: **Settings → Pages → Deploy from a branch → main → / (root)**.
4. Open `https://<user>.github.io/rdevx-2026-prototypes/horizon/` and verify the relative links.
