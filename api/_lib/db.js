const { MongoClient } = require('mongodb');

const PREFIX = process.env.COLLECTION_PREFIX || '';

let clientPromise = null;
let indexesPromise = null;

function getClient() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000
    }).connect();
    clientPromise.catch(() => { clientPromise = null; });
  }
  return clientPromise;
}

async function getCollection(name) {
  const client = await getClient();
  const db = client.db();
  if (!indexesPromise) {
    indexesPromise = Promise.all([
      db.collection(PREFIX + 'users').createIndex({ usernameLower: 1 }, { unique: true }),
      db.collection(PREFIX + 'sessions').createIndex({ tokenHash: 1 }, { unique: true }),
      db.collection(PREFIX + 'sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection(PREFIX + 'rateLimits').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
    ]);
    indexesPromise.catch(() => { indexesPromise = null; });
  }
  await indexesPromise;
  return db.collection(PREFIX + name);
}

module.exports = { getCollection };
