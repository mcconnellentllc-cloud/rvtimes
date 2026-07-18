import { listRecords, createRecord } from './_lib/airtable.js';
import { requirePin, sendError } from './_lib/auth.js';

const TABLE = 'Service Log';
const ALLOWED_FIELDS = ['Date', 'Type', 'Description', 'Mileage', 'Cost', 'Vendor', 'Notes'];

function pickFields(body) {
  const out = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined && body[key] !== '') out[key] = body[key];
  }
  if (out.Mileage !== undefined) out.Mileage = Number(out.Mileage);
  if (out.Cost !== undefined) out.Cost = Number(out.Cost);
  return out;
}

export default async function handler(req, res) {
  try {
    requirePin(req);

    if (req.method === 'GET') {
      const records = await listRecords(TABLE, {
        sort: [{ field: 'Date', direction: 'desc' }],
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

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return sendError(res, err);
  }
}
