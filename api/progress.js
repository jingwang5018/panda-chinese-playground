const { getCollection } = require('./_lib/db');
const { send, serverError, guardWrite, getSessionUser } = require('./_lib/auth');

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
    const user = await getSessionUser(req);
    if (!user) return send(res, 401, { error: 'unauthorized' });

    if (req.method === 'GET') {
      const progress = await getCollection('progress');
      const doc = await progress.findOne({ _id: user.id });
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
      const stars = cleanCount(body.stars);
      const sessions = cleanCount(body.sessions);
      const known = cleanWordMap(body.known);
      const pronounced = cleanWordMap(body.pronounced);
      if (stars === null || sessions === null || known === null || pronounced === null) {
        return send(res, 400, { error: 'invalid data' });
      }
      const now = new Date();
      const progress = await getCollection('progress');
      await progress.updateOne(
        { _id: user.id },
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
