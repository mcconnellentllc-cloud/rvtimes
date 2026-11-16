(function () {
  // Channel database, growing as photos arrive.
  // Sources: EPG and search screenshots from Nov 15, 2026.
  // Total on the box: 1,994 (per the EPG "ALL" count).
  // Categories confirmed on the EPG: ALL, Favorite, Network TV, Regional Locals,
  // Sports Networks, 24/7, PPV Events, MLS — and more below the fold.
  const CHANNELS = [
    { n: 87,  name: 'HBO 2' },
    { n: 88,  name: 'HBO Comedy' },
    { n: 89,  name: 'HBO East' },
    { n: 90,  name: 'HBO Signature' },
    { n: 91,  name: 'HBO West' },
    { n: 92,  name: 'HGTV East' },
    { n: 93,  name: 'HGTV West' },
    { n: 94,  name: 'History' },
    { n: 95,  name: 'HLN' },
    { n: 193, name: 'HBO Zone' },
    { n: 205, name: 'HBO Drama East' },
    { n: 206, name: 'HBO Drama West' },
  ];

  const CATEGORIES = [
    'ALL',
    'Favorite',
    'Network TV',
    'Regional Locals',
    'Sports Networks',
    '24/7',
    'PPV Events',
    'MLS',
  ];

  const TOTAL_ON_BOX = 1994;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function normalize(s) {
    return String(s || '').toLowerCase().trim();
  }

  function matches(ch, needle) {
    if (!needle) return true;
    const hay = normalize(ch.name + ' ' + ch.n);
    return needle.split(/\s+/).filter(Boolean).every((tok) => hay.includes(tok));
  }

  function render(needle) {
    const tbody = document.querySelector('#ch-table tbody');
    const empty = document.getElementById('ch-empty');
    const meter = document.getElementById('ch-meter');

    const sorted = CHANNELS.slice().sort((a, b) => a.n - b.n);
    const filtered = sorted.filter((ch) => matches(ch, needle));

    tbody.innerHTML = filtered.map((ch) => `
      <tr>
        <td class="n">${ch.n}</td>
        <td>${esc(ch.name)}</td>
      </tr>
    `).join('');

    empty.hidden = filtered.length > 0;
    const docTotal = CHANNELS.length;
    meter.textContent = needle
      ? `${filtered.length} of ${docTotal} documented match`
      : `${docTotal} of ~${TOTAL_ON_BOX} channels documented on the box`;
  }

  function renderCategories() {
    const bar = document.getElementById('ch-cats');
    if (!bar) return;
    bar.innerHTML = CATEGORIES.map((c) => `<span class="ch-cat">${esc(c)}</span>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    const input = document.getElementById('ch-input');
    const clear = document.getElementById('ch-clear');
    input.addEventListener('input', () => render(normalize(input.value)));
    clear.addEventListener('click', () => { input.value = ''; render(''); input.focus(); });
    render('');
  });
})();
