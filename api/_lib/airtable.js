const AIRTABLE_API = 'https://api.airtable.com/v0';

function requireEnv() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) {
    const missing = [];
    if (!token) missing.push('AIRTABLE_TOKEN');
    if (!baseId) missing.push('AIRTABLE_BASE_ID');
    const err = new Error(`Missing env var(s): ${missing.join(', ')}`);
    err.statusCode = 500;
    throw err;
  }
  return { token, baseId };
}

async function airtableFetch(path, init = {}) {
  const { token, baseId } = requireEnv();
  const url = `${AIRTABLE_API}/${baseId}/${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(body?.error?.message || `Airtable error ${res.status}`);
    err.statusCode = res.status;
    err.airtable = body;
    throw err;
  }
  return body;
}

export async function listRecords(table, { pageSize = 100, sort } = {}) {
  const params = new URLSearchParams();
  params.set('pageSize', String(pageSize));
  if (sort) {
    sort.forEach((s, i) => {
      params.set(`sort[${i}][field]`, s.field);
      if (s.direction) params.set(`sort[${i}][direction]`, s.direction);
    });
  }
  const all = [];
  let offset;
  do {
    if (offset) params.set('offset', offset);
    const body = await airtableFetch(`${encodeURIComponent(table)}?${params.toString()}`);
    all.push(...(body.records || []));
    offset = body.offset;
  } while (offset);
  return all;
}

export async function createRecord(table, fields) {
  return airtableFetch(encodeURIComponent(table), {
    method: 'POST',
    body: JSON.stringify({ fields }),
  });
}

export async function updateRecord(table, recordId, fields) {
  return airtableFetch(`${encodeURIComponent(table)}/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  });
}
