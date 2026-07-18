(function () {
  const state = { records: [] };
  const LOW_THRESHOLD = 2;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function isLow(qty) {
    const n = Number(qty);
    return !Number.isFinite(n) || n <= LOW_THRESHOLD;
  }
  function isOut(qty) {
    const n = Number(qty);
    return !Number.isFinite(n) || n <= 0;
  }

  function stats() {
    const total = state.records.length;
    const lowout = state.records.filter((r) => isLow(r.fields?.['Qty'])).length;
    document.getElementById('stat-parts').textContent = String(total);
    document.getElementById('stat-lowout').textContent = String(lowout);
  }

  function render() {
    const tbody = document.querySelector('#parts-table tbody');
    const empty = document.getElementById('parts-empty');
    const rows = state.records.slice();

    if (rows.length === 0) {
      tbody.innerHTML = '';
      empty.hidden = false;
    } else {
      empty.hidden = true;
      tbody.innerHTML = rows.map((r) => {
        const f = r.fields || {};
        const qty = Number(f['Qty']) || 0;
        const low = isLow(qty);
        const out = isOut(qty);
        return `<tr data-id="${esc(r.id)}" class="${low ? 'low' : ''}">
          <td>${esc(f['Part'] || '')}${out ? ' <span class="qty-flag">Out</span>' : (low ? ' <span class="qty-flag">Low</span>' : '')}</td>
          <td>${esc(f['Category'] || '')}</td>
          <td>
            <span class="qty-cell">
              <button class="qty-btn" data-act="dec" ${qty <= 0 ? 'disabled' : ''}>&minus;</button>
              <input class="qty-input" type="number" inputmode="numeric" min="0" value="${qty}" data-qty>
              <button class="qty-btn" data-act="inc">+</button>
            </span>
          </td>
          <td>${esc(f['Location'] || '')}</td>
          <td>${esc(f['Part #'] || '')}</td>
          <td>${esc(f['Notes'] || '')}</td>
        </tr>`;
      }).join('');
    }
    stats();
  }

  async function patchQty(id, nextQty) {
    return window.Auth.apiFetch('api/parts-inventory', {
      method: 'PATCH',
      body: { id, fields: { Qty: nextQty } },
    });
  }

  async function changeQty(id, delta, absolute) {
    const row = state.records.find((r) => r.id === id);
    if (!row) return;
    const current = Number(row.fields?.['Qty']) || 0;
    let next = absolute != null ? Number(absolute) : current + delta;
    if (!Number.isFinite(next) || next < 0) next = 0;
    next = Math.floor(next);
    if (next === current) return;

    row.fields = row.fields || {};
    row.fields['Qty'] = next;
    render();

    try {
      const res = await patchQty(id, next);
      if (res && res.record) {
        const idx = state.records.findIndex((r) => r.id === id);
        if (idx !== -1) state.records[idx] = res.record;
        render();
      }
    } catch (err) {
      row.fields['Qty'] = current;
      render();
      alert('Update failed: ' + err.message);
    }
  }

  function bindTable() {
    const tbody = document.querySelector('#parts-table tbody');
    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('.qty-btn');
      if (!btn) return;
      const tr = btn.closest('tr[data-id]');
      if (!tr) return;
      const id = tr.dataset.id;
      const act = btn.dataset.act;
      if (act === 'inc') changeQty(id, +1);
      else if (act === 'dec') changeQty(id, -1);
    });
    tbody.addEventListener('change', (e) => {
      const input = e.target.closest('input[data-qty]');
      if (!input) return;
      const tr = input.closest('tr[data-id]');
      if (!tr) return;
      const id = tr.dataset.id;
      const val = Math.max(0, Math.floor(Number(input.value) || 0));
      input.value = val;
      changeQty(id, 0, val);
    });
  }

  async function load() {
    try {
      const data = await window.Auth.apiFetch('api/parts-inventory');
      state.records = Array.isArray(data.records) ? data.records : [];
      render();
    } catch (e) {
      console.error('parts load failed', e);
    }
  }

  function openDialog() {
    const dlg = document.getElementById('dlg-parts');
    dlg.querySelector('form').reset();
    dlg.querySelector('input[name="Qty"]').value = '1';
    dlg.dataset.open = 'true';
  }

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = {};
    new FormData(form).forEach((v, k) => { if (v !== '' && v != null) fields[k] = v; });
    try {
      const res = await window.Auth.apiFetch('api/parts-inventory', {
        method: 'POST',
        body: fields,
      });
      if (res.record) state.records.push(res.record);
      state.records.sort((a, b) => String(a.fields?.['Part'] || '').localeCompare(String(b.fields?.['Part'] || '')));
      render();
      document.getElementById('dlg-parts').dataset.open = 'false';
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  }

  function init() {
    document.getElementById('parts-refresh').addEventListener('click', load);
    document.getElementById('parts-add').addEventListener('click', openDialog);
    document.getElementById('form-parts').addEventListener('submit', submit);
    bindTable();
    load();
  }

  window.PartsInventory = { init, reload: load };
})();
