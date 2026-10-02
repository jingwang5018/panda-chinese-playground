const { MongoClient } = require('mongodb');

let clientPromise = null;
function getClient() {
  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000
    }).connect();
    clientPromise.catch(() => { clientPromise = null; });
  }
  return clientPromise;
}

const ID_RE = /^[a-zA-Z0-9-]{16,64}$/;
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
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const id = req.query && req.query.id;
      if (typeof id !== 'string' || !ID_RE.test(id)) {
        return res.status(400).json({ error: 'invalid id' });
      }
      const client = await getClient();
      const doc = await client.db().collection('progress').findOne({ _id: id });
      if (!doc) return res.status(404).json({ error: 'not found' });
      return res.status(200).json({
        stars: doc.stars || 0,
        known: doc.known || {},
        pronounced: doc.pronounced || {},
        sessions: doc.sessions || 0,
        updatedAt: doc.updatedAt
      });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = req.body && typeof req.body === 'object' ? req.body : null;
      if (!body || typeof body.id !== 'string' || !ID_RE.test(body.id)) {
        return res.status(400).json({ error: 'invalid id' });
      }
      const stars = cleanCount(body.stars);
      const sessions = cleanCount(body.sessions);
      const known = cleanWordMap(body.known);
      const pronounced = cleanWordMap(body.pronounced);
      if (stars === null || sessions === null || known === null || pronounced === null) {
        return res.status(400).json({ error: 'invalid data' });
      }
      const now = new Date();
      const client = await getClient();
      await client.db().collection('progress').updateOne(
        { _id: body.id },
        {
          $set: { stars, sessions, known, pronounced, updatedAt: now },
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );
      return res.status(200).json({ ok: true, updatedAt: now });
    }

    res.setHeader('Allow', 'GET, PUT, POST');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error('progress api error:', err && err.message);
    return res.status(500).json({ error: 'server error' });
  }
};
