(function () {
  const STORE_KEY = 'diplomat.checks.v1';

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    } catch {
      return {};
    }
  }
  function saveState(state) {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  const state = loadState();

  function stepKey(listKey, index) {
    return `${listKey}:${index}`;
  }

  function applyStep(step, checked) {
    step.dataset.checked = checked ? 'true' : 'false';
  }

  function updateProgress(sectionId) {
    const section = document.querySelector(`.section[data-section="${sectionId}"]`);
    if (!section) return;
    const steps = section.querySelectorAll('.step');
    const done = section.querySelectorAll('.step[data-checked="true"]').length;
    const meta = section.querySelector('[data-progress]');
    if (meta) meta.textContent = steps.length ? `${done} / ${steps.length}` : '';
  }

  function initSteps() {
    document.querySelectorAll('.steps').forEach((list) => {
      const listKey = list.dataset.steps;
      const section = list.closest('.section');
      const sectionId = section?.dataset.section;
      const steps = list.querySelectorAll('.step');
      steps.forEach((step, i) => {
        const key = stepKey(listKey, i);
        applyStep(step, !!state[key]);
        step.addEventListener('click', () => {
          const next = step.dataset.checked !== 'true';
          applyStep(step, next);
          if (next) state[key] = true; else delete state[key];
          saveState(state);
          if (sectionId) updateProgress(sectionId);
        });
      });
      if (sectionId) updateProgress(sectionId);
    });
  }

  function activateTab(target) {
    if (!target) return;
    const tabs = document.querySelectorAll('.tab');
    let matched = false;
    tabs.forEach((t) => {
      const on = t.dataset.section === target;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) matched = true;
    });
    if (!matched) return;
    document.querySelectorAll('.section').forEach((s) => {
      s.dataset.active = s.dataset.section === target ? 'true' : 'false';
    });
  }

  function activateFromHash() {
    const hash = (window.location.hash || '').replace(/^#/, '');
    if (!hash.startsWith('section-')) return;
    activateTab(hash.slice('section-'.length));
  }

  function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        activateTab(tab.dataset.section);
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      });
    });
    activateFromHash();
    window.addEventListener('hashchange', activateFromHash);
  }

  function initReset() {
    const btn = document.querySelector('[data-reset]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const activeSection = document.querySelector('.section[data-active="true"]');
      if (!activeSection) return;
      const sectionId = activeSection.dataset.section;
      activeSection.querySelectorAll('.steps').forEach((list) => {
        const listKey = list.dataset.steps;
        list.querySelectorAll('.step').forEach((step, i) => {
          applyStep(step, false);
          delete state[stepKey(listKey, i)];
        });
      });
      saveState(state);
      updateProgress(sectionId);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSteps();
    initReset();
  });
})();
