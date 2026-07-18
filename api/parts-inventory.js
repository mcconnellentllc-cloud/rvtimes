import { listRecords, createRecord, updateRecord } from './_lib/airtable.js';
import { requirePin, sendError } from './_lib/auth.js';

const TABLE = 'Parts Inventory';
const ALLOWED_FIELDS = ['Part', 'Category', 'Qty', 'Location', 'Part #', 'Notes'];

function pickFields(body) {
  const out = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined && body[key] !== '') out[key] = body[key];
  }
  if (out.Qty !== undefined) {
    const n = Number(out.Qty);
    out.Qty = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  }
  return out;
}

export default async function handler(req, res) {
  try {
    requirePin(req);

    if (req.method === 'GET') {
      const records = await listRecords(TABLE, {
        sort: [{ field: 'Part', direction: 'asc' }],
      });
      return res.status(200).json({ records });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const fields = pickFields(body);
      if (Object.keys(fields).length === 0) {
        return res.status(400).json({ error: 'No valid fields provided' });
      }
      const record = await createRecord(TABLE, fields);
      return res.status(201).json({ record });
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { id, fields: rawFields } = body || {};
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing record id' });
      }
      const fields = pickFields(rawFields || {});
      if (Object.keys(fields).length === 0) {
        return res.status(400).json({ error: 'No valid fields provided' });
      }
      const record = await updateRecord(TABLE, id, fields);
      return res.status(200).json({ record });
    }

    res.setHeader('Allow', 'GET, POST, PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return sendError(res, err);
  }
}
