import { timingSafeEqual } from 'node:crypto';

function safeEqual(a, b) {
  const aBuf = Buffer.from(String(a));
  const bBuf = Buffer.from(String(b));
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function requirePin(req) {
  const expected = process.env.LOGBOOK_PIN;
  if (!expected) {
    const err = new Error('Server misconfigured: LOGBOOK_PIN not set');
    err.statusCode = 500;
    throw err;
  }
  const provided = req.headers?.['x-logbook-pin'];
  if (!provided || !safeEqual(provided, expected)) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
}

export function sendError(res, err) {
  const status = err.statusCode || 500;
  const message = status === 500 && process.env.NODE_ENV === 'production'
    ? 'Server error'
    : err.message;
  res.status(status).json({ error: message });
}
