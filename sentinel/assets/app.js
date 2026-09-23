(() => {
  "use strict";

  const body = document.body;
  const storageKey = `rdevx:${body.dataset.project || "root"}`;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function safeParse(value, fallback) {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }

  function getStore() {
    return safeParse(localStorage.getItem(storageKey), {});
  }

  function setStore(patch) {
    const next = { ...getStore(), ...patch };
    localStorage.setItem(storageKey, JSON.stringify(next));
    return next;
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

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[char]);
  }

  function setUiState(state, persist = true) {
    const allowed = ["empty", "loading", "unknown", "success"];
    const next = allowed.includes(state) ? state : "success";
    body.dataset.uiState = next;
    $$("[data-state-button]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.stateButton === next));
    });
    $$(".state-card").forEach(card => card.classList.toggle("active", card.dataset.state === next));
    if (persist) setStore({ uiState: next });
    announce(`Interface state changed to ${next}.`);
  }

  function initStateSwitcher() {
    const stateButtons = $$("[data-state-button]");
    if (!stateButtons.length) return;
    const saved = getStore().uiState || "success";
    setUiState(saved, false);
    stateButtons.forEach(button => button.addEventListener("click", () => setUiState(button.dataset.stateButton)));
  }

  function initSidebar() {
    const sidebar = $(".sidebar");
    const menuButton = $("[data-mobile-menu]");
    if (!sidebar || !menuButton) return;
    menuButton.addEventListener("click", () => {
      const open = sidebar.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        sidebar.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initSelectionGroups() {
    $$('[data-choice-group]').forEach(group => {
      const cards = $$('[data-choice]', group);
      cards.forEach(card => {
        const activate = () => {
          cards.forEach(item => {
            const selected = item === card;
            item.classList.toggle("selected", selected);
            item.setAttribute("aria-pressed", String(selected));
          });
          const outputId = group.dataset.output;
          if (outputId) {
            const output = document.getElementById(outputId);
            if (output) output.textContent = card.dataset.choice;
          }
          setStore({ [`choice:${group.dataset.choiceGroup}`]: card.dataset.choice });
          announce(`${card.dataset.choice} selected.`);
        };
        card.addEventListener("click", activate);
        card.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); }
        });
      });
      const stored = getStore()[`choice:${group.dataset.choiceGroup}`];
      const initial = cards.find(card => card.dataset.choice === stored) || cards.find(card => card.classList.contains("selected"));
      if (initial && stored) initial.click();
    });
  }

  function initSlots() {
    const slotButtons = $$('[data-slot]');
    if (!slotButtons.length) return;
    slotButtons.forEach(button => button.addEventListener("click", () => {
      slotButtons.forEach(item => item.classList.remove("selected"));
      button.classList.add("selected");
      const output = $("[data-selected-slot]");
      if (output) output.textContent = button.dataset.slot;
      setStore({ selectedSlot: button.dataset.slot });
      announce(`${button.dataset.slot} selected.`);
    }));
    const saved = getStore().selectedSlot;
    const initial = slotButtons.find(button => button.dataset.slot === saved) || slotButtons.find(button => button.classList.contains("selected"));
    if (initial) initial.click();
  }

  function initDates() {
    const cards = $$('[data-date]');
    if (!cards.length) return;
    cards.forEach(card => card.addEventListener("click", () => {
      cards.forEach(item => item.classList.remove("selected"));
      card.classList.add("selected");
      const output = $("[data-selected-date]");
      if (output) output.textContent = card.dataset.date;
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

    $$('[data-filter-value]').forEach(button => {
      button.addEventListener("click", () => {
        const group = button.closest("[data-filter-group]");
        if (!group) return;
        const value = button.dataset.filterValue;
        $$('[data-filter-value]', group).forEach(item => item.classList.toggle("active", item === button));
        const target = document.querySelector(group.dataset.filterGroup);
        if (!target) return;
        $$('[data-filter-row]', target).forEach(row => {
          row.hidden = value !== "all" && row.dataset.filterCategory !== value;
        });
        announce(`${button.textContent.trim()} filter applied.`);
      });
    });
  }

  function initSort() {
    $$('[data-sort]').forEach(button => {
      button.addEventListener("click", () => {
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
      });
    });
  }

  function initRows() {
    $$('[data-select-row]').forEach(row => {
      row.tabIndex = 0;
      const select = () => {
        const table = row.closest("table");
        $$('[data-select-row]', table || document).forEach(item => item.classList.remove("selected"));
        row.classList.add("selected");
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
      drawers.forEach(drawer => {
        drawer.classList.remove("open");
        drawer.setAttribute("aria-hidden", "true");
      });
      backdrop?.classList.remove("open");
    };
    $$('[data-open-drawer]').forEach(button => button.addEventListener("click", () => {
      closeAll();
      const drawer = document.getElementById(button.dataset.openDrawer);
      if (!drawer) return;
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      backdrop?.classList.add("open");
      window.setTimeout(() => drawer.querySelector("button, a, input")?.focus(), 50);
    }));
    $$('[data-close-drawer]').forEach(button => button.addEventListener("click", closeAll));
    backdrop?.addEventListener("click", closeAll);
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeAll(); });
  }

  function initModals() {
    const backdrop = $(".modal-backdrop");
    const modals = $$(".modal");
    const closeAll = () => {
      modals.forEach(modal => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
      });
      backdrop?.classList.remove("open");
    };
    $$('[data-open-modal]').forEach(button => button.addEventListener("click", () => {
      closeAll();
      const modal = document.getElementById(button.dataset.openModal);
      if (!modal) return;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      backdrop?.classList.add("open");
      window.setTimeout(() => modal.querySelector("button, a, input")?.focus(), 50);
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
      toast(action, button.dataset.confirmMessage || "The client-side prototype state was updated.");
      setStore({ [`action:${body.dataset.screen || "page"}`]: action });
    }));
  }

  function initReadiness() {
    const button = $("[data-run-checks]");
    if (!button) return;
    button.addEventListener("click", () => {
      button.disabled = true;
      button.innerHTML = '<span class="spinner"></span> Running checks';
      setUiState("loading");
      window.setTimeout(() => {
        setUiState("success");
        button.disabled = false;
        button.textContent = "Run checks again";
        $$('[data-check-status]').forEach(status => { status.textContent = "PASS"; status.className = "badge success"; });
        toast("Readiness verified", "All critical checks passed on this device.");
      }, 1100);
    });
  }

  function initConsent() {
    const recordButton = $("[data-record-consent]");
    if (!recordButton) return;
    const required = $$('[data-consent-required]');
    const update = () => {
      recordButton.disabled = required.some(input => !input.checked);
    };
    required.forEach(input => input.addEventListener("change", update));
    update();
    recordButton.addEventListener("click", () => {
      const decisions = $$('[data-consent-toggle]').map(input => ({ id: input.name, value: input.checked }));
      setStore({ consent: decisions, consentRecorded: true });
      toast("Consent choices recorded", "Purpose-specific decisions were timestamped and remain withdrawable.");
      recordButton.textContent = "Choices recorded";
      recordButton.disabled = true;
    });
  }

  function initBriefing() {
    const button = $("[data-acknowledge]");
    const checkbox = $("[data-briefing-check]");
    if (!button || !checkbox) return;
    const update = () => { button.disabled = !checkbox.checked; };
    checkbox.addEventListener("change", update);
    update();
    button.addEventListener("click", () => {
      setStore({ briefingAcknowledged: true });
      toast("Briefing acknowledged", "Version v3.2.0 and timestamp were recorded.");
      button.textContent = "Acknowledged";
      button.disabled = true;
    });
  }

  function initInterview() {
    const start = $("[data-interview-start]");
    const pause = $("[data-interview-pause]");
    const end = $("[data-interview-end]");
    const status = $("[data-interview-status]");
    const progress = $("[data-interview-progress]");
    if (!status) return;
    let active = false;
    start?.addEventListener("click", () => {
      active = true;
      status.textContent = "Response capture active";
      status.className = "badge success";
      start.textContent = "Recording response";
      start.disabled = true;
      toast("Response window started", "Evidence will be retained with question and consent provenance.");
    });
    pause?.addEventListener("click", () => {
      if (!active) return toast("Nothing to pause", "Start the response window first.");
      active = false;
      status.textContent = "Paused";
      status.className = "badge warning";
      start.disabled = false;
      start.textContent = "Resume response";
      toast("Interview paused", "The current question and evidence window were preserved.");
    });
    end?.addEventListener("click", () => {
      active = false;
      status.textContent = "Candidate-ended";
      status.className = "badge neutral";
      start.disabled = true;
      pause.disabled = true;
      if (progress) progress.style.setProperty("--progress", "38%");
      toast("Interview ended safely", "A terminal reason was recorded; no final hiring decision was made.");
    });
  }

  function initOperations() {
    $$('[data-operation]').forEach(row => row.addEventListener("click", () => {
      const group = row.closest("[data-operation-group]") || document;
      $$('[data-operation]', group).forEach(item => item.classList.toggle("selected", item === row));
      const output = $("[data-selected-operation]");
      if (output) output.textContent = row.dataset.operation;
      const action = $("[data-prepare-operation]");
      if (action) action.disabled = false;
      announce(`${row.dataset.operation} selected.`);
    }));
  }

  function initGates() {
    const rows = $$('[data-gate]');
    const decision = $("[data-release-decision]");
    if (!rows.length || !decision) return;
    const update = () => {
      const blocking = rows.some(row => ["fail", "unknown"].includes(row.dataset.gateState));
      decision.disabled = blocking;
      const reason = $("[data-release-block-reason]");
      if (reason) reason.hidden = !blocking;
    };
    rows.forEach(row => {
      $$('[data-gate-set]', row).forEach(button => button.addEventListener("click", () => {
        row.dataset.gateState = button.dataset.gateSet;
        const badge = $("[data-gate-badge]", row);
        if (badge) {
          badge.textContent = button.dataset.gateSet.toUpperCase();
          badge.className = `badge ${button.dataset.gateSet === "pass" ? "success" : button.dataset.gateSet === "fail" ? "danger" : "unknown"}`;
        }
        update();
      }));
    });
    update();
  }

  function initActionStates() {
    $$('[data-action-state]').forEach(button => button.addEventListener("click", () => {
      const state = button.dataset.actionState;
      const target = document.querySelector(button.dataset.actionTarget || "[data-selected-action-state]");
      if (target) {
        target.textContent = state;
        target.className = `badge ${state.toLowerCase().includes("overdue") ? "danger" : state.toLowerCase().includes("complete") ? "success" : "warning"}`;
      }
      toast("Action state updated", `The action is now ${state}.`);
    }));
  }

  function initAssistant() {
    const form = $("[data-chat-form]");
    const input = $("[data-chat-input]");
    const chat = $("[data-chat]");
    if (!form || !input || !chat) return;
    const responses = [
      "The current milestone forecast is outside the approved tolerance. One dependency is overdue and no valid exception is recorded.",
      "The smallest safe next step is to open the deterministic workbench and review the overdue action. Chat cannot commit a lifecycle transition.",
      "The evidence is current and traceable. Customer-facing escalation still requires the named Client Partner to approve the exact packet."
    ];
    form.addEventListener("submit", event => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      const user = document.createElement("div");
      user.className = "chat-bubble user";
      user.innerHTML = `<p>${escapeHtml(question)}</p>`;
      chat.append(user);
      input.value = "";
      const loading = document.createElement("div");
      loading.className = "chat-bubble assistant";
      loading.innerHTML = '<p><span class="spinner"></span> Grounding the response in authorized records…</p>';
      chat.append(loading);
      chat.scrollTop = chat.scrollHeight;
      window.setTimeout(() => {
        const answer = responses[Math.floor(Math.random() * responses.length)];
        loading.innerHTML = `<p>${escapeHtml(answer)}</p><div class="citations"><span class="pill info">Source fact F-01</span><span class="pill unknown">Policy OBJ-08</span><span class="pill neutral">No execution authority</span></div>`;
        chat.scrollTop = chat.scrollHeight;
      }, 650);
    });
  }

  function initJourney() {
    const steps = $$('[data-journey-step]');
    if (!steps.length) return;
    const nodes = $$('[data-journey-node]');
    let index = Math.max(0, Math.min(steps.length - 1, Number(getStore()[`journey:${body.dataset.journey}`]) || 0));
    const render = () => {
      steps.forEach((step, i) => step.classList.toggle("current", i === index));
      nodes.forEach((node, i) => {
        node.classList.toggle("active", i === index);
        node.classList.toggle("complete", i < index);
      });
      const current = steps[index];
      current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      const counter = $("[data-journey-counter]");
      if (counter) counter.textContent = `Step ${index + 1} of ${steps.length}`;
      const previous = $("[data-journey-prev]");
      const next = $("[data-journey-next]");
      if (previous) previous.disabled = index === 0;
      if (next) next.textContent = index === steps.length - 1 ? "Restart journey" : "Next step";
      setStore({ [`journey:${body.dataset.journey}`]: index });
    };
    $("[data-journey-prev]")?.addEventListener("click", () => { index = Math.max(0, index - 1); render(); });
    $("[data-journey-next]")?.addEventListener("click", () => { index = index === steps.length - 1 ? 0 : index + 1; render(); });
    steps.forEach((step, i) => step.addEventListener("click", event => {
      if (event.target.closest("a, button")) return;
      index = i; render();
    }));
    render();
  }

  function initTabs() {
    $$('[data-tabs]').forEach(tabs => {
      const buttons = $$('[data-tab]', tabs);
      const panels = $$('[data-tab-panel]', tabs);
      buttons.forEach(button => button.addEventListener("click", () => {
        buttons.forEach(item => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-selected", String(active));
        });
        panels.forEach(panel => panel.hidden = panel.dataset.tabPanel !== button.dataset.tab);
      }));
    });
  }

  function initGenericButtonGroups() {
    $$(".segmented").forEach(group => {
      const buttons = $$('button', group);
      buttons.forEach(button => button.addEventListener("click", () => {
        buttons.forEach(item => item.classList.toggle("active", item === button));
        announce(`${button.textContent.trim()} selected.`);
      }));
    });
    $$(".inbox-item:not([data-choice])").forEach(item => item.addEventListener("click", () => {
      const group = item.parentElement;
      $$(".inbox-item", group).forEach(row => row.classList.toggle("selected", row === item));
      announce(`${item.textContent.trim()} selected.`);
    }));
  }

  function initPrint() {
    $$('[data-print]').forEach(button => button.addEventListener("click", () => window.print()));
  }

  function initProgressiveCards() {
    $$('[data-expand]').forEach(button => button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.expand);
      if (!target) return;
      const open = target.classList.toggle("hidden") === false;
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? (button.dataset.collapseLabel || "Show less") : (button.dataset.expandLabel || "Show details");
    }));
  }

  function init() {
    initStateSwitcher();
    initSidebar();
    initSelectionGroups();
    initSlots();
    initDates();
    initFilters();
    initSort();
    initRows();
    initDrawers();
    initModals();
    initActions();
    initReadiness();
    initConsent();
    initBriefing();
    initInterview();
    initOperations();
    initGates();
    initActionStates();
    initAssistant();
    initJourney();
    initTabs();
    initGenericButtonGroups();
    initPrint();
    initProgressiveCards();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
