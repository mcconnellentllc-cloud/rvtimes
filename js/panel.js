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

  function stepKey(sectionId, index) {
    return `${sectionId}:${index}`;
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
      const sectionId = list.dataset.steps;
      const steps = list.querySelectorAll('.step');
      steps.forEach((step, i) => {
        const key = stepKey(sectionId, i);
        applyStep(step, !!state[key]);
        step.addEventListener('click', () => {
          const next = step.dataset.checked !== 'true';
          applyStep(step, next);
          state[key] = next;
          if (!next) delete state[key];
          saveState(state);
          updateProgress(sectionId);
        });
      });
      updateProgress(sectionId);
    });
  }

  function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.section;
        tabs.forEach((t) => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
        document.querySelectorAll('.section').forEach((s) => {
          s.dataset.active = s.dataset.section === target ? 'true' : 'false';
        });
      });
    });
  }

  function initReset() {
    const btn = document.querySelector('[data-reset]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const activeSection = document.querySelector('.section[data-active="true"]');
      if (!activeSection) return;
      const sectionId = activeSection.dataset.section;
      activeSection.querySelectorAll('.step').forEach((step, i) => {
        applyStep(step, false);
        delete state[stepKey(sectionId, i)];
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
