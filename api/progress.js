const { getCollection } = require('./_lib/db');
const { send, tooMany, serverError, guardWrite, clientIp, hitLimit } = require('./_lib/http');

// Visitors are anonymous: each browser generates a random UUID v4 and uses it as the key of its own progress document.
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CAT_RE = /^[a-z]{1,20}$/;

function cleanWordMap(input) {
  if (input === undefined) return {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const keys = Object.keys(input);
  if (keys.length > 20) return null;
  const out = {};
  for (const key of keys) {
    const list = input[key];
    if (!CAT_RE.test(key) || !Array.isArray(list) || list.length > 50) return null;
    if (!list.every((w) => typeof w === 'string' && w.length >= 1 && w.length <= 10)) return null;
    out[key] = Array.from(new Set(list));
  }
  return out;
}

function cleanCount(value) {
  if (value === undefined) return 0;
  if (!Number.isInteger(value) || value < 0 || value > 100000) return null;
  return value;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const id = req.query && req.query.id;
      if (typeof id !== 'string' || !ID_RE.test(id)) return send(res, 400, { error: 'invalid id' });
      if (!(await hitLimit('progress:get:' + clientIp(req), 1500, 3600))) return tooMany(res);
      const progress = await getCollection('progress');
      const doc = await progress.findOne({ _id: id.toLowerCase() });
      if (!doc) return send(res, 404, { error: 'not found' });
      return send(res, 200, {
        stars: doc.stars || 0,
        known: doc.known || {},
        pronounced: doc.pronounced || {},
        sessions: doc.sessions || 0,
        updatedAt: doc.updatedAt
      });
    }

    if (req.method === 'PUT') {
      if (!guardWrite(req, res)) return;
      const body = req.body && typeof req.body === 'object' ? req.body : {};
      if (typeof body.id !== 'string' || !ID_RE.test(body.id)) return send(res, 400, { error: 'invalid id' });
      const stars = cleanCount(body.stars);
      const sessions = cleanCount(body.sessions);
      const known = cleanWordMap(body.known);
      const pronounced = cleanWordMap(body.pronounced);
      if (stars === null || sessions === null || known === null || pronounced === null) {
        return send(res, 400, { error: 'invalid data' });
      }
      if (!(await hitLimit('progress:put:' + clientIp(req), 1500, 3600))) return tooMany(res);
      const now = new Date();
      const progress = await getCollection('progress');
      await progress.updateOne(
        { _id: body.id.toLowerCase() },
        {
          $set: { stars, sessions, known, pronounced, updatedAt: now },
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );
      return send(res, 200, { ok: true, updatedAt: now });
    }

    res.setHeader('Allow', 'GET, PUT');
    return send(res, 405, { error: 'method not allowed' });
  } catch (err) {
    return serverError(res, err);
  }
};
