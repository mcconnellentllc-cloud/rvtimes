(function () {
  // Maintenance log for the Diplomat. Date is YYYY-MM-DD. Hours is engine or
  // generator hours at the time; leave blank if not recorded. Cost is parts +
  // labor combined. Who = who did it. Notes = anything worth remembering.
  // Add newest entries at the TOP of this array.
  const RECORDS = [
    {
      date: '2026-11-15',
      system: 'Chassis',
      service: 'Interior bulb replacement (1141)',
      hours: '',
      cost: '',
      who: 'self',
      notes: 'Swapped a burned-out interior bulb for an LED 1141 from the bulk pack.',
      parts: [{ qty: 1, part: '1141 LED (warm white)', source: 'Walmart Supercenter Sterling' }],
    },
    {
      date: '2026-11-14',
      system: 'Generator',
      service: 'Oil & filter change',
      hours: '2252.4',
      cost: '',
      who: 'self',
      notes: 'Onan Quiet Diesel 7500 (HDKAJ). First change at these hours. Ran under load afterward to seat oil.',
      parts: [
        { qty: 1, part: 'Onan oil filter 122-0836', source: 'Cummins / Onan dealer' },
        { qty: 7, part: 'Rotella T4 15W-40', source: 'Walmart Supercenter Sterling' },
      ],
    },
    {
      date: '2026-11-13',
      system: 'Internet',
      service: 'Starlink Mini install',
      hours: '',
      cost: '',
      who: 'self',
      notes: 'Mounted outside the coach. Powered off a USB-C PD port in the dash. SSID set to "M77Ag RV" with a WPA2 password. Replaced the open factory "STARLINK" SSID.',
      parts: [
        { qty: 1, part: 'Starlink Mini', source: 'Starlink' },
        { qty: 1, part: 'USB-C PD cable, 6 ft', source: 'Amazon' },
      ],
    },
  ];

  const SYSTEMS = ['All', 'Chassis', 'Engine', 'Generator', 'HVAC', 'Plumbing', 'Electrical', 'Internet', 'Roof', 'Tires', 'Interior'];

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function normalize(s) { return String(s || '').toLowerCase().trim(); }

  function matchesText(r, needle) {
    if (!needle) return true;
    const hay = normalize([r.date, r.system, r.service, r.who, r.notes, (r.parts || []).map(p => p.part + ' ' + (p.source || '')).join(' ')].join(' '));
    return needle.split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
  }

  let activeSystem = 'All';

  function render() {
    const listEl = document.getElementById('m-list');
    const emptyEl = document.getElementById('m-empty');
    const meterEl = document.getElementById('m-meter');
    const input = document.getElementById('m-input');
    const needle = normalize(input.value);

    const filtered = RECORDS.filter((r) => matchesText(r, needle))
      .filter((r) => activeSystem === 'All' || r.system === activeSystem)
      .sort((a, b) => b.date.localeCompare(a.date));

    listEl.innerHTML = filtered.map((r) => {
      const parts = (r.parts || []).map((p) => `
        <li>${esc(p.qty || '')}&times; ${esc(p.part)}${p.source ? ' &mdash; <span class="mt-src">' + esc(p.source) + '</span>' : ''}</li>
      `).join('');
      return `
        <article class="mt-card" data-system="${esc(r.system)}">
          <header class="mt-head">
            <span class="mt-date">${esc(r.date)}</span>
            <span class="mt-system">${esc(r.system)}</span>
          </header>
          <h3 class="mt-service">${esc(r.service)}</h3>
          <dl class="mt-meta">
            ${r.hours ? `<div><dt>Hours</dt><dd>${esc(r.hours)}</dd></div>` : ''}
            ${r.cost ? `<div><dt>Cost</dt><dd>$${esc(r.cost)}</dd></div>` : ''}
            ${r.who ? `<div><dt>Who</dt><dd>${esc(r.who)}</dd></div>` : ''}
          </dl>
          ${r.notes ? `<p class="mt-notes">${esc(r.notes)}</p>` : ''}
          ${parts ? `<ul class="mt-parts">${parts}</ul>` : ''}
        </article>
      `;
    }).join('');

    emptyEl.hidden = filtered.length > 0;
    const total = RECORDS.length;
    meterEl.textContent = needle || activeSystem !== 'All'
      ? `${filtered.length} of ${total} records match`
      : `${total} records on file`;
  }

  function renderSystems() {
    const bar = document.getElementById('m-systems');
    bar.innerHTML = SYSTEMS.map((s) => `
      <button type="button" class="mt-sys${s === activeSystem ? ' active' : ''}" data-system="${s}">${esc(s)}</button>
    `).join('');
    bar.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeSystem = btn.dataset.system;
        renderSystems();
        render();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderSystems();
    const input = document.getElementById('m-input');
    const clear = document.getElementById('m-clear');
    input.addEventListener('input', render);
    clear.addEventListener('click', () => { input.value = ''; render(); input.focus(); });
    render();
  });
})();
