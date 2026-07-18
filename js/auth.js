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
    const res = await fetch('/api/service-log', {
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

  function init({ onUnlock } = {}) {
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
