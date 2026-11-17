(function () {
  // Diplomat financials. Edit here; the page reads this file verbatim.
  // Dollar amounts as numbers (no $, no commas); the page formats.
  const F = {
    purchase: {
      date: '',           // YYYY-MM-DD
      price: null,        // number
      seller: '',
      location: '',       // where bought / state registered
      notes: '',
    },
    title: {
      location: '',       // where the physical title lives
      state: '',
      scan: '',           // path to an attached scan if we store one (see README)
      notes: '',
    },
    insurance: [
      // One row per year. Newest at the top.
      // {
      //   year: '2026',
      //   company: '',
      //   policyNumber: '',
      //   premium: 0,
      //   effective: 'YYYY-MM-DD',
      //   renews: 'YYYY-MM-DD',
      //   agent: '',
      //   agentPhone: '',
      //   cardScan: '',   // path to card image if attached
      //   notes: '',
      // },
    ],
    annualCosts: [
      // One row per year. Reference totals.
      // { year: '2026', registration: 0, propertyTax: 0, storage: 0, notes: '' }
    ],
  };

  const fmtMoney = (n) => (n == null || n === '')
    ? '<span class="tbd">TBD</span>'
    : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const val = (v) => (v == null || v === '') ? '<span class="tbd">TBD</span>' : esc(v);

  function renderPurchase() {
    const el = document.getElementById('f-purchase');
    const p = F.purchase;
    el.innerHTML = `
      <div class="spec-row"><div class="k">Price paid</div><div class="v">${fmtMoney(p.price)}</div><div class="n">${val(p.notes)}</div></div>
      <div class="spec-row"><div class="k">Date</div><div class="v">${val(p.date)}</div><div class="n">&nbsp;</div></div>
      <div class="spec-row"><div class="k">Seller</div><div class="v">${val(p.seller)}</div><div class="n">${val(p.location)}</div></div>
    `;
  }

  function renderTitle() {
    const el = document.getElementById('f-title');
    const t = F.title;
    el.innerHTML = `
      <div class="spec-row"><div class="k">Title state</div><div class="v">${val(t.state)}</div><div class="n">&nbsp;</div></div>
      <div class="spec-row"><div class="k">Physical title at</div><div class="v">${val(t.location)}</div><div class="n">${val(t.notes)}</div></div>
      <div class="spec-row"><div class="k">Scan on file</div><div class="v">${t.scan ? '<a href="' + esc(t.scan) + '">open</a>' : '<span class="tbd">none attached</span>'}</div><div class="n">See notes about where to keep the file.</div></div>
    `;
  }

  function renderInsurance() {
    const el = document.getElementById('f-insurance');
    if (!F.insurance.length) {
      el.innerHTML = `<div class="spec-row"><div class="k">Insurance</div><div class="v"><span class="tbd">no records yet</span></div><div class="n">Tell me the company, premium, policy number and renewal date and I'll add a row.</div></div>`;
      return;
    }
    el.innerHTML = F.insurance.map((r) => `
      <div class="spec-group" style="margin-bottom: 10px;">
        <h3>${esc(r.year)} &middot; ${val(r.company)} &middot; ${fmtMoney(r.premium)}/yr</h3>
        <div class="spec-row"><div class="k">Policy number</div><div class="v">${val(r.policyNumber)}</div><div class="n">&nbsp;</div></div>
        <div class="spec-row"><div class="k">Effective</div><div class="v">${val(r.effective)}</div><div class="n">Renews ${val(r.renews)}</div></div>
        <div class="spec-row"><div class="k">Agent</div><div class="v">${val(r.agent)}</div><div class="n">${val(r.agentPhone)}</div></div>
        <div class="spec-row"><div class="k">Insurance card</div><div class="v">${r.cardScan ? '<a href="' + esc(r.cardScan) + '">open</a>' : '<span class="tbd">none attached</span>'}</div><div class="n">${val(r.notes)}</div></div>
      </div>
    `).join('');
  }

  function renderCosts() {
    const el = document.getElementById('f-costs');
    if (!F.annualCosts.length) {
      el.innerHTML = `<div class="spec-row"><div class="k">Annual costs</div><div class="v"><span class="tbd">no records yet</span></div><div class="n">Registration, property tax, storage &mdash; add rows as you pay them.</div></div>`;
      return;
    }
    el.innerHTML = F.annualCosts.map((c) => `
      <div class="spec-row"><div class="k">${esc(c.year)}</div>
        <div class="v">Reg ${fmtMoney(c.registration)} &middot; Tax ${fmtMoney(c.propertyTax)} &middot; Storage ${fmtMoney(c.storage)}</div>
        <div class="n">${val(c.notes)}</div>
      </div>
    `).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderPurchase();
    renderTitle();
    renderInsurance();
    renderCosts();
  });
})();
