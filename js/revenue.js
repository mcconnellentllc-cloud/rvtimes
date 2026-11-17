(function () {
  // Revenue from renting the Diplomat out. Dates YYYY-MM-DD. Nightly is the
  // rate charged; nights is the count. Total overrides nightly*nights when
  // set (useful for package deals, cleaning fees bundled in, etc.). Newest
  // entries at the top.
  const RENTALS = [
    // Example shape:
    // {
    //   from: '2026-10-19', to: '2026-10-22',
    //   nights: 3,
    //   guest: 'Steve Diemand',       // internal only
    //   context: '5-day season pass', // reason, booking channel, etc.
    //   nightly: 50,
    //   cleaning: 100,
    //   total: 300,
    //   paid: true,
    //   notes: '',
    // },
  ];

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const fmtMoney = (n) => (n == null || n === '')
    ? '&mdash;'
    : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  function computeTotal(r) {
    if (r.total != null) return Number(r.total);
    return Number(r.nightly || 0) * Number(r.nights || 0) + Number(r.cleaning || 0);
  }

  function byYear(records) {
    const map = {};
    records.forEach((r) => {
      const y = String(r.from || '').slice(0, 4) || 'Unknown';
      map[y] = map[y] || [];
      map[y].push(r);
    });
    return Object.keys(map).sort((a, b) => b.localeCompare(a)).map((y) => ({ year: y, rows: map[y] }));
  }

  function render() {
    const tbody = document.querySelector('#r-table tbody');
    const emptyEl = document.getElementById('r-empty');
    const yearsEl = document.getElementById('r-years');

    const rows = RENTALS.slice().sort((a, b) => String(b.from || '').localeCompare(String(a.from || '')));
    tbody.innerHTML = rows.map((r) => {
      const total = computeTotal(r);
      const dates = r.from === r.to ? esc(r.from) : esc(r.from || '') + '&nbsp;&rsaquo;&nbsp;' + esc(r.to || '');
      return `
        <tr>
          <td class="r-dates">${dates}</td>
          <td>${esc(r.guest || '')}<br><span class="r-ctx">${esc(r.context || '')}</span></td>
          <td class="r-num">${esc(r.nights || '')}</td>
          <td class="r-num">${fmtMoney(r.nightly)}</td>
          <td class="r-num">${fmtMoney(r.cleaning)}</td>
          <td class="r-num r-total">${fmtMoney(total)}</td>
          <td>${r.paid ? '<span class="r-paid">PAID</span>' : '<span class="r-owed">OWED</span>'}</td>
        </tr>
      `;
    }).join('');

    emptyEl.hidden = rows.length > 0;

    // Yearly summary
    const years = byYear(rows);
    const grand = rows.reduce((s, r) => s + computeTotal(r), 0);
    const paid = rows.filter((r) => r.paid).reduce((s, r) => s + computeTotal(r), 0);
    const owed = grand - paid;

    yearsEl.innerHTML = years.map((y) => {
      const yTotal = y.rows.reduce((s, r) => s + computeTotal(r), 0);
      const yPaid = y.rows.filter((r) => r.paid).reduce((s, r) => s + computeTotal(r), 0);
      const yNights = y.rows.reduce((s, r) => s + Number(r.nights || 0), 0);
      return `
        <div class="spec-row">
          <div class="k">${esc(y.year)}</div>
          <div class="v">${y.rows.length} stays &middot; ${yNights} nights &middot; <strong>${fmtMoney(yTotal)}</strong></div>
          <div class="n">Paid ${fmtMoney(yPaid)} &middot; Owed ${fmtMoney(yTotal - yPaid)}</div>
        </div>
      `;
    }).join('') + (years.length ? `
      <div class="spec-row" style="background: var(--bg-elev);">
        <div class="k">All time</div>
        <div class="v">${rows.length} stays &middot; <strong>${fmtMoney(grand)}</strong></div>
        <div class="n">Paid ${fmtMoney(paid)} &middot; Owed ${fmtMoney(owed)}</div>
      </div>
    ` : `<div class="spec-row"><div class="k">No rentals yet</div><div class="v">&mdash;</div><div class="n">Add rows to <code>js/revenue.js</code>.</div></div>`);
  }

  document.addEventListener('DOMContentLoaded', render);
})();
