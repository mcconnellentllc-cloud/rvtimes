(function () {
  const KEY = 'diplomat.pin.v1';

  function getPin() {
    return sessionStorage.getItem(KEY) || '';
  }
  function setPin(pin) {
    sessionStorage.setItem(KEY, pin);
  }
  function clearPin() {
    sessionStorage.removeItem(KEY);
  }

  async function verifyPin(pin) {
    const res = await fetch('api/service-log', {
      method: 'GET',
      headers: { 'x-logbook-pin': pin },
    });
    return res.ok;
  }

  async function apiFetch(path, options = {}) {
    const pin = getPin();
    const headers = Object.assign({}, options.headers || {}, {
      'x-logbook-pin': pin,
    });
    if (options.body && typeof options.body !== 'string') {
      headers['Content-Type'] = 'application/json';
      options = Object.assign({}, options, { body: JSON.stringify(options.body) });
    }
    const res = await fetch(path, Object.assign({}, options, { headers }));
    if (res.status === 401) {
      clearPin();
      showGate();
      throw new Error('Session expired');
    }
    const text = await res.text();
    let body;
    try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
    if (!res.ok) {
      const err = new Error(body?.error || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return body;
  }

  function showGate() {
    document.getElementById('gate').style.display = '';
    document.getElementById('app').hidden = true;
    setTimeout(() => document.getElementById('pin')?.focus(), 20);
  }
  function hideGate() {
    document.getElementById('gate').style.display = 'none';
    document.getElementById('app').hidden = false;
  }

  async function tryUnlock(pin, onUnlock) {
    const errEl = document.getElementById('gate-err');
    errEl.textContent = '';
    if (!pin) { errEl.textContent = 'Enter a PIN'; return; }
    try {
      const ok = await verifyPin(pin);
      if (!ok) { errEl.textContent = 'Incorrect PIN'; return; }
      setPin(pin);
      hideGate();
      if (typeof onUnlock === 'function') onUnlock();
    } catch (e) {
      errEl.textContent = 'Network error';
    }
  }

  async function detectApi() {
    try {
      const res = await fetch('api/service-log', { method: 'GET' });
      const ct = res.headers.get('content-type') || '';
      return ct.includes('application/json');
    } catch {
      return false;
    }
  }

  function showPreviewNotice() {
    const gate = document.getElementById('gate');
    if (!gate) return;
    gate.innerHTML = `
      <h1>Static Preview</h1>
      <div class="hint">Logbook needs the API</div>
      <p style="font-family:var(--sans);font-size:14px;line-height:1.55;color:var(--ink-dim);margin:14px 0 20px;text-align:left;">
        This page reads your maintenance and parts data from Airtable through
        a server function. On a static-only host (like GitHub Pages) that
        function isn't running, so there's nothing to load.
      </p>
      <p style="font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-mute);margin:0 0 20px;text-align:left;">
        To turn it on: deploy to Vercel with AIRTABLE_TOKEN,
        AIRTABLE_BASE_ID and LOGBOOK_PIN set.
      </p>
      <a href="index.html" class="go" style="display:block;text-decoration:none;text-align:center;">Back to Guide</a>
    `;
  }

  async function init({ onUnlock } = {}) {
    const apiOk = await detectApi();
    if (!apiOk) {
      showPreviewNotice();
      return;
    }

    const existing = getPin();
    if (existing) {
      verifyPin(existing).then((ok) => {
        if (ok) { hideGate(); if (onUnlock) onUnlock(); }
        else { clearPin(); showGate(); }
      });
    } else {
      showGate();
    }

    const btn = document.getElementById('unlock');
    const pinInput = document.getElementById('pin');
    btn.addEventListener('click', () => tryUnlock(pinInput.value.trim(), onUnlock));
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryUnlock(pinInput.value.trim(), onUnlock);
    });
  }

  function lock() {
    clearPin();
    document.getElementById('pin').value = '';
    showGate();
  }

  window.Auth = { init, lock, apiFetch };
})();
