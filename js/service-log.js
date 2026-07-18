(function () {
  const state = { records: [] };

  const fmtMoney = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return '';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  };
  const fmtMiles = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return '';
    return num.toLocaleString('en-US');
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function render() {
    const tbody = document.querySelector('#service-table tbody');
    const empty = document.getElementById('service-empty');
    const rows = state.records.slice();

    if (rows.length === 0) {
      tbody.innerHTML = '';
      empty.hidden = false;
    } else {
      empty.hidden = true;
      tbody.innerHTML = rows.map((r) => {
        const f = r.fields || {};
        return `<tr>
          <td>${esc(f['Date'] || '')}</td>
          <td>${esc(f['Type'] || '')}</td>
          <td>${esc(f['Description'] || '')}</td>
          <td class="num">${fmtMiles(f['Mileage'])}</td>
          <td class="num">${f['Cost'] != null ? esc(fmtMoney(f['Cost'])) : ''}</td>
          <td>${esc(f['Vendor'] || '')}</td>
          <td>${esc(f['Notes'] || '')}</td>
        </tr>`;
      }).join('');
    }

    const total = rows.reduce((s, r) => s + (Number(r.fields?.['Cost']) || 0), 0);
    document.getElementById('stat-total').textContent = fmtMoney(total);
    document.getElementById('stat-count').textContent = String(rows.length);

    const withMiles = rows
      .map((r) => ({ d: r.fields?.['Date'], m: Number(r.fields?.['Mileage']) }))
      .filter((x) => Number.isFinite(x.m));
    withMiles.sort((a, b) => String(b.d || '').localeCompare(String(a.d || '')));
    const lastMi = withMiles[0]?.m;
    document.getElementById('stat-mileage').textContent = Number.isFinite(lastMi) ? fmtMiles(lastMi) : '—';
  }

  async function load() {
    try {
      const data = await window.Auth.apiFetch('/api/service-log');
      state.records = Array.isArray(data.records) ? data.records : [];
      render();
    } catch (e) {
      console.error('service load failed', e);
    }
  }

  function openDialog() {
    const dlg = document.getElementById('dlg-service');
    dlg.querySelector('form').reset();
    const dateInput = dlg.querySelector('input[name="Date"]');
    if (dateInput && !dateInput.value) {
      const d = new Date();
      const iso = d.toISOString().slice(0, 10);
      dateInput.value = iso;
    }
    dlg.dataset.open = 'true';
  }

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = {};
    new FormData(form).forEach((v, k) => { if (v !== '' && v != null) fields[k] = v; });
    try {
      const res = await window.Auth.apiFetch('/api/service-log', {
        method: 'POST',
        body: fields,
      });
      if (res.record) state.records.unshift(res.record);
      render();
      document.getElementById('dlg-service').dataset.open = 'false';
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  }

  function init() {
    document.getElementById('service-refresh').addEventListener('click', load);
    document.getElementById('service-add').addEventListener('click', openDialog);
    document.getElementById('form-service').addEventListener('submit', submit);
    load();
  }

  window.ServiceLog = { init, reload: load };
})();
