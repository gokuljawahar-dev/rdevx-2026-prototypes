(() => {
  "use strict";

  const PRODUCT = {"id": "sentinel", "label": "Sentinel", "signature": "operations", "signatureSelector": ".signal-row", "responses": ["The milestone forecast moved outside tolerance, one critical dependency is overdue, and no approved exception exists. The risk remains active.", "The smallest safe next step is to open the deterministic lifecycle workbench. Conversation cannot commit a transition or approval.", "Customer escalation is still blocked. The named Client Partner must approve the exact recipients, payload hash, scope and expiry."], "stateNoun": "risk-governance instrument"};
  const body = document.body;
  const screenKey = body.dataset.screen || body.dataset.journey || "home";
  const storageKey = `rdevx:${PRODUCT.id}:workspace`;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safeParse(value, fallback) {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }

  function getStore() {
    try { return safeParse(localStorage.getItem(storageKey), {}); }
    catch { return {}; }
  }

  function setStore(patch) {
    const next = { ...getStore(), ...patch };
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* private mode */ }
    return next;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[char]);
  }

  function announce(message) {
    const region = $("#live-region");
    if (!region) return;
    region.textContent = "";
    window.setTimeout(() => { region.textContent = message; }, 20);
  }

  function toast(title, message = "") {
    let region = $(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      document.body.append(region);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<strong>${escapeHtml(title)}</strong>${message ? `<span>${escapeHtml(message)}</span>` : ""}`;
    region.append(el);
    window.setTimeout(() => el.remove(), 4200);
    announce(`${title}. ${message}`);
  }

  function buttonState(selector, pressed, activeLabel, inactiveLabel) {
    $$(selector).forEach(button => {
      button.setAttribute("aria-pressed", String(pressed));
      const label = $(".control-label", button);
      if (label) label.textContent = pressed ? activeLabel : inactiveLabel;
    });
  }

  function applyWorkspaceState(store = getStore()) {
    body.classList.toggle("nav-collapsed", Boolean(store.navCollapsed));
    body.classList.toggle("focus-mode", Boolean(store.focusMode));
    body.classList.toggle("context-hidden", Boolean(store.contextHidden));
    body.classList.toggle("density-compact", store.density === "compact");
    body.dataset.density = store.density === "compact" ? "compact" : "comfortable";
    buttonState("[data-sidebar-toggle]", Boolean(store.navCollapsed), "Expand", "Navigation");
    buttonState("[data-focus-toggle]", Boolean(store.focusMode), "Exit focus", "Focus");
    buttonState("[data-context-toggle]", Boolean(store.contextHidden), "Show context", "Context panel");
    buttonState("[data-density-toggle]", store.density === "compact", "Comfortable", "Density");
  }

  function toggleWorkspace(key) {
    const current = getStore();
    const patch = {};
    if (key === "density") patch.density = current.density === "compact" ? "comfortable" : "compact";
    else patch[key] = !current[key];
    const next = setStore(patch);
    applyWorkspaceState(next);
    const messages = {
      navCollapsed: next.navCollapsed ? "Navigation collapsed to the icon rail." : "Navigation expanded.",
      focusMode: next.focusMode ? "Focus mode enabled; the working area is full width." : "Focus mode disabled.",
      contextHidden: next.contextHidden ? "Context panel hidden." : "Context panel restored.",
      density: next.density === "compact" ? "Compact density enabled." : "Comfortable density enabled."
    };
    announce(messages[key]);
  }

  function initShellControls() {
    const store = getStore();
    applyWorkspaceState({ density: "comfortable", ...store });
    $$('[data-sidebar-toggle]').forEach(button => button.addEventListener("click", event => {
      event.preventDefault(); toggleWorkspace("navCollapsed");
    }));
    $$('[data-focus-toggle]').forEach(button => button.addEventListener("click", () => toggleWorkspace("focusMode")));
    $$('[data-context-toggle]').forEach(button => button.addEventListener("click", () => toggleWorkspace("contextHidden")));
    $$('[data-density-toggle]').forEach(button => button.addEventListener("click", () => toggleWorkspace("density")));

    const sidebar = $(".sidebar");
    const mobile = $("[data-mobile-menu]");
    mobile?.addEventListener("click", () => {
      const open = sidebar?.classList.toggle("open");
      mobile.setAttribute("aria-expanded", String(Boolean(open)));
    });

    document.addEventListener("keydown", event => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable)) return;
      if (event.key === "[") { event.preventDefault(); toggleWorkspace("navCollapsed"); }
      if (event.key.toLowerCase() === "f") { event.preventDefault(); toggleWorkspace("focusMode"); }
      if (event.key.toLowerCase() === "d" && $("[data-density-toggle]")) { event.preventDefault(); toggleWorkspace("density"); }
      if (event.key === "Escape") {
        sidebar?.classList.remove("open");
        mobile?.setAttribute("aria-expanded", "false");
      }
    });
  }

  function stateMessage(state) {
    const card = $(`.state-card[data-state="${state}"]`);
    return {
      title: card?.querySelector("h3")?.textContent.trim() || state,
      message: card?.querySelector("p")?.textContent.trim() || `${PRODUCT.label} is showing the ${state} state.`
    };
  }

  function renderStateOverlay(state) {
    $$(".state-dim").forEach(surface => {
      surface.querySelector(":scope > .state-overlay")?.remove();
      if (state === "success") return;
      const copy = stateMessage(state);
      const overlay = document.createElement("div");
      overlay.className = "state-overlay";
      overlay.dataset.state = state;
      overlay.setAttribute("role", "status");
      const icon = state === "loading" ? '<span class="spinner" aria-hidden="true"></span>' : state === "unknown" ? "!" : "○";
      overlay.innerHTML = `<div class="state-overlay-card"><div aria-hidden="true">${icon}</div><h3>${escapeHtml(copy.title)}</h3><p>${escapeHtml(copy.message)}</p>${state === "unknown" ? '<button class="btn ghost" type="button" data-state-retry>Retry current evidence</button>' : ""}</div>`;
      surface.append(overlay);
      overlay.querySelector("[data-state-retry]")?.addEventListener("click", () => {
        toast("Revalidation requested", "The prototype restored the verified Success view.");
        setUiState("success");
      });
    });
  }

  function setUiState(state, persist = true) {
    const allowed = ["empty", "loading", "unknown", "success"];
    const next = allowed.includes(state) ? state : "success";
    body.dataset.uiState = next;
    $$('[data-state-button]').forEach(button => button.setAttribute("aria-pressed", String(button.dataset.stateButton === next)));
    $$(".state-card").forEach(card => card.classList.toggle("active", card.dataset.state === next));
    renderStateOverlay(next);
    if (persist) setStore({ [`state:${screenKey}`]: next });
    announce(`${PRODUCT.label} ${PRODUCT.stateNoun} changed to ${next}.`);
  }

  function initStateSwitcher() {
    const buttons = $$('[data-state-button]');
    if (!buttons.length) return;
    const saved = getStore()[`state:${screenKey}`] || body.dataset.uiState || "success";
    setUiState(saved, false);
    buttons.forEach(button => button.addEventListener("click", () => setUiState(button.dataset.stateButton)));
  }

  function initLeverFiltering() {
    const buttons = $$('[data-lever-filter]');
    const instruments = $$('[data-levers]');
    if (!buttons.length || !instruments.length) return;
    const apply = value => {
      let shown = 0;
      instruments.forEach(item => {
        const match = value === "all" || (item.dataset.levers || "").split(/\s+/).includes(value);
        item.hidden = !match;
        if (match) shown += 1;
      });
      buttons.forEach(button => button.classList.toggle("active", button.dataset.leverFilter === value));
      const summary = $("[data-filter-summary]");
      if (summary) summary.textContent = `${shown} instrument${shown === 1 ? "" : "s"} shown`;
      setStore({ leverFilter: value });
      announce(`${value === "all" ? "All levers" : value} filter applied. ${shown} instruments shown.`);
    };
    buttons.forEach(button => button.addEventListener("click", () => apply(button.dataset.leverFilter)));
    apply(getStore().leverFilter || "all");
  }

  function initSelectionGroups() {
    $$('[data-choice-group]').forEach(group => {
      const cards = $$('[data-choice]', group);
      const key = `choice:${group.dataset.choiceGroup}`;
      const activate = card => {
        cards.forEach(item => {
          const selected = item === card;
          item.classList.toggle("selected", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
        const output = group.dataset.output ? document.getElementById(group.dataset.output) : null;
        if (output) output.textContent = card.dataset.choice;
        setStore({ [key]: card.dataset.choice });
        announce(`${card.dataset.choice} selected.`);
      };
      cards.forEach(card => {
        card.addEventListener("click", () => activate(card));
        card.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(card); }
        });
      });
      const saved = getStore()[key];
      const initial = cards.find(card => card.dataset.choice === saved) || cards.find(card => card.classList.contains("selected"));
      if (initial) activate(initial);
    });
  }

  function initSlotsAndDates() {
    const slots = $$('[data-slot]');
    slots.forEach(button => button.addEventListener("click", () => {
      slots.forEach(item => item.classList.toggle("selected", item === button));
      const output = $("[data-selected-slot]");
      if (output) output.textContent = button.dataset.slot;
      setStore({ selectedSlot: button.dataset.slot });
      announce(`${button.dataset.slot} selected.`);
    }));
    const savedSlot = getStore().selectedSlot;
    const initialSlot = slots.find(button => button.dataset.slot === savedSlot) || slots.find(button => button.classList.contains("selected"));
    if (initialSlot) initialSlot.click();

    const dates = $$('[data-date]');
    dates.forEach(card => card.addEventListener("click", () => {
      dates.forEach(item => item.classList.toggle("selected", item === card));
      const output = $("[data-selected-date]");
      if (output) output.textContent = card.dataset.date;
      setStore({ selectedDate: card.dataset.date });
      announce(`${card.dataset.date} selected.`);
    }));
  }

  function initFilters() {
    $$('[data-filter-input]').forEach(input => {
      const target = document.querySelector(input.dataset.filterInput);
      if (!target) return;
      const rows = $$('[data-filter-row]', target);
      const apply = () => {
        const query = input.value.trim().toLowerCase();
        let visible = 0;
        rows.forEach(row => {
          const match = !query || row.textContent.toLowerCase().includes(query);
          row.hidden = !match;
          if (match) visible += 1;
        });
        const count = $("[data-filter-count]");
        if (count) count.textContent = `${visible} result${visible === 1 ? "" : "s"}`;
      };
      input.addEventListener("input", apply);
      apply();
    });

    $$('[data-filter-value]').forEach(button => button.addEventListener("click", () => {
      const group = button.closest("[data-filter-group]");
      if (!group) return;
      const value = button.dataset.filterValue;
      $$('[data-filter-value]', group).forEach(item => item.classList.toggle("active", item === button));
      const target = document.querySelector(group.dataset.filterGroup);
      if (!target) return;
      $$('[data-filter-row]', target).forEach(row => { row.hidden = value !== "all" && row.dataset.filterCategory !== value; });
      announce(`${button.textContent.trim()} filter applied.`);
    }));
  }

  function initSort() {
    $$('[data-sort]').forEach(button => button.addEventListener("click", () => {
      const table = button.closest("table");
      const tbody = table?.tBodies?.[0];
      if (!tbody) return;
      const index = Number(button.dataset.sort);
      const direction = button.dataset.direction === "asc" ? "desc" : "asc";
      button.dataset.direction = direction;
      const rows = Array.from(tbody.rows);
      rows.sort((a, b) => {
        const av = a.cells[index]?.dataset.sortValue || a.cells[index]?.textContent.trim() || "";
        const bv = b.cells[index]?.dataset.sortValue || b.cells[index]?.textContent.trim() || "";
        return av.localeCompare(bv, undefined, { numeric: true }) * (direction === "asc" ? 1 : -1);
      });
      rows.forEach(row => tbody.append(row));
      announce(`Table sorted ${direction}.`);
    }));
  }

  function initRows() {
    $$('[data-select-row]').forEach(row => {
      row.tabIndex = 0;
      const select = () => {
        const table = row.closest("table");
        $$('[data-select-row]', table || document).forEach(item => item.classList.toggle("selected", item === row));
        const target = document.querySelector(row.dataset.selectRow);
        if (target) {
          const data = safeParse(row.dataset.detail, {});
          Object.entries(data).forEach(([key, value]) => {
            const el = target.querySelector(`[data-detail="${key}"]`);
            if (el) el.textContent = value;
          });
        }
        announce(`${row.cells?.[0]?.textContent.trim() || "Row"} selected.`);
      };
      row.addEventListener("click", select);
      row.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); }
      });
    });
  }

  function initDrawers() {
    const backdrop = $(".drawer-backdrop");
    const drawers = $$(".drawer");
    const closeAll = () => {
      drawers.forEach(drawer => { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); });
      backdrop?.classList.remove("open");
    };
    $$('[data-open-drawer]').forEach(button => button.addEventListener("click", () => {
      closeAll();
      const drawer = document.getElementById(button.dataset.openDrawer);
      if (!drawer) return;
      drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); backdrop?.classList.add("open");
      window.setTimeout(() => drawer.querySelector("button, a, input")?.focus(), 40);
    }));
    $$('[data-close-drawer]').forEach(button => button.addEventListener("click", closeAll));
    backdrop?.addEventListener("click", closeAll);
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeAll(); });
  }

  function initModals() {
    const backdrop = $(".modal-backdrop");
    const modals = $$(".modal");
    const closeAll = () => {
      modals.forEach(modal => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); });
      backdrop?.classList.remove("open");
    };
    $$('[data-open-modal]').forEach(button => button.addEventListener("click", () => {
      closeAll();
      const modal = document.getElementById(button.dataset.openModal);
      if (!modal) return;
      modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); backdrop?.classList.add("open");
      window.setTimeout(() => modal.querySelector("button, a, input")?.focus(), 40);
    }));
    $$('[data-close-modal]').forEach(button => button.addEventListener("click", closeAll));
    backdrop?.addEventListener("click", closeAll);
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeAll(); });
  }

  function initActions() {
    $$('[data-toast]').forEach(button => button.addEventListener("click", () => {
      const [title, message] = (button.dataset.toast || "Action recorded|").split("|");
      toast(title, message);
      if (button.dataset.setState) setUiState(button.dataset.setState);
      if (button.dataset.disableAfter === "true") button.disabled = true;
    }));
    $$('[data-confirm-action]').forEach(button => button.addEventListener("click", () => {
      const action = button.dataset.confirmAction;
      button.disabled = true;
      button.textContent = button.dataset.confirmedLabel || "Recorded";
      button.classList.remove("primary", "secondary", "danger");
      button.classList.add("ghost");
      toast(action, button.dataset.confirmMessage || "The local prototype state was updated.");
      setStore({ [`action:${screenKey}`]: action });
    }));
  }

  function initGatewayControls() {
    const run = $("[data-run-checks]");
    run?.addEventListener("click", () => {
      run.disabled = true; run.innerHTML = '<span class="spinner"></span> Running checks'; setUiState("loading");
      window.setTimeout(() => {
        setUiState("success"); run.disabled = false; run.textContent = "Run checks again";
        $$('[data-check-status]').forEach(status => { status.textContent = "PASS"; status.className = "badge success"; });
        toast("Readiness verified", "All critical checks passed on this device.");
      }, reducedMotion ? 0 : 900);
    });
    const record = $("[data-record-consent]");
    if (record) {
      const required = $$('[data-consent-required]');
      const update = () => { record.disabled = required.some(input => !input.checked); };
      required.forEach(input => input.addEventListener("change", update)); update();
      record.addEventListener("click", () => {
        const decisions = $$('[data-consent-toggle]').map(input => ({ id: input.name, value: input.checked }));
        setStore({ consent: decisions, consentRecorded: true });
        record.textContent = "Choices recorded"; record.disabled = true;
        toast("Consent choices recorded", "Purpose-specific decisions were timestamped and remain withdrawable.");
      });
    }
    const ack = $("[data-acknowledge]");
    const check = $("[data-briefing-check]");
    if (ack && check) {
      const update = () => { ack.disabled = !check.checked; }; check.addEventListener("change", update); update();
      ack.addEventListener("click", () => { ack.textContent = "Acknowledged"; ack.disabled = true; setStore({ briefingAcknowledged: true }); toast("Briefing acknowledged", "Version v3.2.0 and timestamp were recorded."); });
    }
    const start = $("[data-interview-start]");
    const pause = $("[data-interview-pause]");
    const end = $("[data-interview-end]");
    const status = $("[data-interview-status]");
    const progress = $("[data-interview-progress]");
    if (status) {
      let active = false;
      start?.addEventListener("click", () => { active = true; status.textContent = "Response capture active"; status.className = "badge success"; start.textContent = "Recording response"; start.disabled = true; toast("Response window started", "Question, consent and evidence provenance are pinned."); });
      pause?.addEventListener("click", () => { if (!active) return toast("Nothing to pause", "Start the response window first."); active = false; status.textContent = "Paused"; status.className = "badge warning"; start.disabled = false; start.textContent = "Resume response"; toast("Interview paused", "The current question and evidence window were preserved."); });
      end?.addEventListener("click", () => { active = false; status.textContent = "Candidate-ended"; status.className = "badge neutral"; if (start) start.disabled = true; if (pause) pause.disabled = true; progress?.style.setProperty("--progress", "38%"); toast("Interview ended safely", "A terminal reason was recorded; no hiring decision was made."); });
    }
  }

  function initOperationsAndGates() {
    $$('[data-operation]').forEach(row => row.addEventListener("click", () => {
      const group = row.closest("[data-operation-group]") || document;
      $$('[data-operation]', group).forEach(item => item.classList.toggle("selected", item === row));
      const output = $("[data-selected-operation]"); if (output) output.textContent = row.dataset.operation;
      const action = $("[data-prepare-operation]"); if (action) action.disabled = false;
      announce(`${row.dataset.operation} selected.`);
    }));
    const gates = $$('[data-gate]');
    const decision = $("[data-release-decision]");
    const update = () => {
      if (!decision) return;
      const blocking = gates.some(row => ["fail", "unknown"].includes(row.dataset.gateState));
      decision.disabled = blocking;
      const reason = $("[data-release-block-reason]"); if (reason) reason.hidden = !blocking;
    };
    gates.forEach(row => $$('[data-gate-set]', row).forEach(button => button.addEventListener("click", () => {
      row.dataset.gateState = button.dataset.gateSet;
      const badge = $("[data-gate-badge]", row);
      if (badge) { badge.textContent = button.dataset.gateSet.toUpperCase(); badge.className = `badge ${button.dataset.gateSet === "pass" ? "success" : button.dataset.gateSet === "fail" ? "danger" : "unknown"}`; }
      update();
    })));
    update();
    $$('[data-action-state]').forEach(button => button.addEventListener("click", () => {
      const state = button.dataset.actionState;
      const target = document.querySelector(button.dataset.actionTarget || "[data-selected-action-state]");
      if (target) { target.textContent = state; target.className = `badge ${state.toLowerCase().includes("overdue") ? "danger" : state.toLowerCase().includes("complete") ? "success" : "warning"}`; }
      toast("Action state updated", `The action is now ${state}.`);
    }));
  }

  function initAssistant() {
    const form = $("[data-chat-form]");
    const input = $("[data-chat-input]");
    const chat = $("[data-chat]");
    if (!form || !input || !chat) return;
    form.addEventListener("submit", event => {
      event.preventDefault();
      const question = input.value.trim(); if (!question) return;
      const user = document.createElement("div"); user.className = "chat-bubble user"; user.innerHTML = `<p>${escapeHtml(question)}</p>`; chat.append(user); input.value = "";
      const loading = document.createElement("div"); loading.className = "chat-bubble assistant"; loading.innerHTML = '<p><span class="spinner"></span> Grounding the response in authorized records…</p>'; chat.append(loading); chat.scrollTop = chat.scrollHeight;
      window.setTimeout(() => {
        const answer = PRODUCT.responses[Math.floor(Math.random() * PRODUCT.responses.length)];
        loading.innerHTML = `<p>${escapeHtml(answer)}</p><div class="citations"><span class="pill info">Authorized evidence</span><span class="pill unknown">Policy bound</span><span class="pill neutral">No execution authority</span></div>`;
        chat.scrollTop = chat.scrollHeight;
      }, reducedMotion ? 0 : 560);
    });
  }

  function initJourney() {
    const steps = $$('[data-journey-step]');
    if (!steps.length) return;
    const nodes = $$('[data-journey-node]');
    const key = `journey:${body.dataset.journey}`;
    let index = Math.max(0, Math.min(steps.length - 1, Number(getStore()[key]) || 0));
    const render = () => {
      steps.forEach((step, i) => step.classList.toggle("current", i === index));
      nodes.forEach((node, i) => { node.classList.toggle("active", i === index); node.classList.toggle("complete", i < index); });
      steps[index]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
      const counter = $("[data-journey-counter]"); if (counter) counter.textContent = `Step ${index + 1} of ${steps.length}`;
      const prev = $("[data-journey-prev]"); const next = $("[data-journey-next]");
      if (prev) prev.disabled = index === 0;
      if (next) next.textContent = index === steps.length - 1 ? "Restart journey" : "Next step";
      setStore({ [key]: index });
    };
    $("[data-journey-prev]")?.addEventListener("click", () => { index = Math.max(0, index - 1); render(); });
    $("[data-journey-next]")?.addEventListener("click", () => { index = index === steps.length - 1 ? 0 : index + 1; render(); });
    steps.forEach((step, i) => step.addEventListener("click", event => { if (event.target.closest("a, button")) return; index = i; render(); }));
    render();
  }

  function initTabsAndExpanders() {
    $$('[data-tabs]').forEach(tabs => {
      const buttons = $$('[data-tab]', tabs); const panels = $$('[data-tab-panel]', tabs);
      buttons.forEach(button => button.addEventListener("click", () => {
        buttons.forEach(item => { const active = item === button; item.classList.toggle("active", active); item.setAttribute("aria-selected", String(active)); });
        panels.forEach(panel => { panel.hidden = panel.dataset.tabPanel !== button.dataset.tab; });
      }));
    });
    $$('[data-expand]').forEach(button => button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.expand); if (!target) return;
      const open = target.classList.toggle("hidden") === false;
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? (button.dataset.collapseLabel || "Show less") : (button.dataset.expandLabel || "Show details");
    }));
    $$(".segmented").forEach(group => {
      const buttons = $$("button", group);
      buttons.forEach(button => button.addEventListener("click", () => { buttons.forEach(item => item.classList.toggle("active", item === button)); announce(`${button.textContent.trim()} selected.`); }));
    });
    $$(".inbox-item:not([data-choice])").forEach(item => item.addEventListener("click", () => {
      const group = item.parentElement; $$(".inbox-item", group).forEach(row => row.classList.toggle("selected", row === item)); announce(`${item.textContent.trim()} selected.`);
    }));
  }

  function initGenericInputs() {
    $$("select").forEach(select => select.addEventListener("change", () => {
      setStore({ [`select:${screenKey}:${select.id || select.getAttribute("aria-label") || "control"}`]: select.value });
      announce(`${select.value} selected.`);
    }));
    $$("input[type=checkbox]:not([data-consent-required]):not([data-briefing-check])").forEach(input => input.addEventListener("change", () => announce(`${input.name || input.id || "Option"} ${input.checked ? "enabled" : "disabled"}.`)));
  }

  function initSignature() {
    if (PRODUCT.signature === "candidate") return;
    $$(PRODUCT.signatureSelector).forEach(item => {
      item.tabIndex = 0;
      const select = () => {
        $$(PRODUCT.signatureSelector).forEach(row => row.classList.toggle("selected", row === item));
        const headline = item.querySelector("strong, b")?.textContent.trim() || "Item";
        toast(`${headline} selected`, PRODUCT.signature === "cockpit" ? "The exception remains read-only until a governed instrument is opened." : "Evidence and severity remain visible before any governed action.");
      };
      item.addEventListener("click", select);
      item.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); } });
    });
  }

  function initClock() {
    const clock = $("[data-live-clock]");
    if (!clock) return;
    const render = () => { clock.textContent = new Intl.DateTimeFormat("en-GB", { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false, timeZone:"Asia/Kolkata" }).format(new Date()); };
    render(); window.setInterval(render, 1000);
  }

  function initPrint() { $$('[data-print]').forEach(button => button.addEventListener("click", () => window.print())); }

  function init() {
    initShellControls();
    initStateSwitcher();
    initLeverFiltering();
    initSelectionGroups();
    initSlotsAndDates();
    initFilters();
    initSort();
    initRows();
    initDrawers();
    initModals();
    initActions();
    initGatewayControls();
    initOperationsAndGates();
    initAssistant();
    initJourney();
    initTabsAndExpanders();
    initGenericInputs();
    initSignature();
    initClock();
    initPrint();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
