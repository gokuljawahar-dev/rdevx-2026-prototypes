# Gateway — AI-Powered Level 1 Candidate Screening

## Product intent

Deliver a timely, evidence-linked Level 1 screening package while preserving candidate clarity, dignity, consent and human decision authority.

## Design language for Gateway

- **Layout archetype:** Guided, human-centered progression with a persistent six-stage progress rail instead of a monitoring console.
- **Typography:** Warm, larger system typography with generous line height, sentence-case headings and low-pressure instructional copy.
- **Color and surface:** Calm ivory and mist surfaces, deep teal ink, sea-green progress, slate-blue information and restrained amber/red only for rights or recovery states.
- **Spacing and density:** A 6/12/18/30px rhythm with wide gutters, large touch targets and deliberate breathing room around consent and recovery controls.
- **Signature component:** Candidate dignity rail: stage, current gate, preserved progress and named human authority remain visible throughout the journey.
- **Screen-space controls:** Persistent sidebar collapse ([), focus mode (F), context-panel toggle and remembered comfort density.

## Governance levers

- **L01 — Scheduling:** Bounded slot choice, conflict-safe commit, confirmation, reminders and reversible change.
- **L02 — Proper Stage Setting:** Explain purpose, format, competencies, duration, AI involvement, preparation and result timing.
- **L03 — Check Prerequisites:** Validate browser, network, camera, microphone, screen share and approved media prerequisites.
- **L04 — Capture Consent:** Protect rights through purpose-specific recording, AI-evaluation, privacy and retention decisions.
- **L05 — Conduct Interview:** Use approved competency coverage with bounded wording, pause, clarification and visible capture state.
- **L06 — Detailed Result Submission:** Deliver an evidence-linked scorecard with deterministic validation, limitations and human disposition.

## Instruments

- **I-01 — Scheduling Assistant + Structured Slot Picker:** Conflict-safe scheduling with timezone clarity, version recheck and idempotent commitment.
- **I-02 — Stage Briefing + Acknowledgement:** Versioned stage-setting separates explanation from authoritative acknowledgement.
- **I-03 — Readiness Check + Remediation:** Worst-first diagnostics block unsafe starts while preserving bounded recovery.
- **I-04 — Digital Consent Workflow:** Purpose-specific consent is explicit, durable and withdrawable.
- **I-05 — Structured AI Interview Conductor:** Approved question intent, candidate controls and evidence capture stay visible.
- **I-06 — Evidence-Linked Scorecard + Review Dashboard:** Evidence, limitations, deterministic validation and human disposition remain separately inspectable.

## Guided journeys

- **J1 — New case with no confirmed slot:** A new case progresses through six explicit gates before human review.
- **J2 — Booked mid-journey case:** A returning candidate resumes from typed state without repeating valid progress.
- **J3 — Camera failure with slot preserved:** The selected 4:00 PM slot and prior progress remain intact while readiness recovers safely.
- **J4 — Reviewer evidence gap:** A bounded clarification creates a superseding scorecard without overwriting history.

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

1. Place this folder at `rdevx-2026-prototypes/gateway/` and keep the repo-root `index.html` beside the three project folders.
2. Commit and push to `main`.
3. In GitHub: **Settings → Pages → Deploy from a branch → main → / (root)**.
4. Open `https://<user>.github.io/rdevx-2026-prototypes/gateway/` and verify the relative links.
