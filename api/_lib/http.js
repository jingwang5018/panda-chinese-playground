const { getCollection } = require('./db');

function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

function tooMany(res, message) {
  res.setHeader('Retry-After', '900');
  return send(res, 429, { error: message || '尝试次数太多了，请稍后再试' });
}

function serverError(res, err) {
  console.error('api error:', err && err.message);
  return send(res, 500, { error: '服务器出了点小问题，请稍后再试' });
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch (e) {
    return false;
  }
}

function guardWrite(req, res) {
  if (!sameOrigin(req)) {
    send(res, 403, { error: '请求来源不被允许' });
    return false;
  }
  const type = String(req.headers['content-type'] || '').toLowerCase();
  if (type.indexOf('application/json') !== 0) {
    send(res, 415, { error: '请求格式不正确' });
    return false;
  }
  return true;
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || (req.socket && req.socket.remoteAddress) || 'unknown';
}

// Fixed-window counter stored in MongoDB; returns false once `limit` is exceeded.
async function hitLimit(key, limit, windowSeconds) {
  const col = await getCollection('rateLimits');
  const doc = await col.findOneAndUpdate(
    { _id: key },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + windowSeconds * 1000) } },
    { upsert: true, returnDocument: 'after' }
  );
  return doc.count <= limit;
}

module.exports = { send, tooMany, serverError, guardWrite, clientIp, hitLimit };
