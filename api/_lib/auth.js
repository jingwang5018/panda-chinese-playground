const crypto = require('crypto');
const { promisify } = require('util');
const { getCollection } = require('./db');

const scrypt = promisify(crypto.scrypt);

const COOKIE_NAME = 'lb_session';
const SESSION_DAYS = 30;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };
const USERNAME_RE = /^[A-Za-z0-9_一-龥]{2,20}$/;

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

/* ---------- passwords ---------- */

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, 64, SCRYPT_PARAMS);
  return ['scrypt', SCRYPT_PARAMS.N, SCRYPT_PARAMS.r, SCRYPT_PARAMS.p, salt.toString('hex'), key.toString('hex')].join('$');
}

async function verifyPassword(password, stored) {
  const parts = String(stored).split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const expected = Buffer.from(parts[5], 'hex');
  const key = await scrypt(password, Buffer.from(parts[4], 'hex'), expected.length, {
    N: Number(parts[1]), r: Number(parts[2]), p: Number(parts[3])
  });
  return crypto.timingSafeEqual(key, expected);
}

let dummyHash = null;
async function burnTime(password) {
  if (!dummyHash) dummyHash = await hashPassword('timing-equaliser-password-1');
  await verifyPassword(password, dummyHash);
}

function validateNewCredentials(username, password) {
  if (typeof username !== 'string' || !USERNAME_RE.test(username.trim())) {
    return '用户名需要 2-20 个字符，只能包含中文、字母、数字和下划线';
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return '密码需要 8-128 个字符';
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return '密码需要同时包含字母和数字';
  }
  if (password.toLowerCase() === username.trim().toLowerCase()) {
    return '密码不能和用户名相同';
  }
  return null;
}

/* ---------- request guards ---------- */

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

async function hitLimit(key, limit, windowSeconds) {
  const col = await getCollection('rateLimits');
  const doc = await col.findOneAndUpdate(
    { _id: key },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + windowSeconds * 1000) } },
    { upsert: true, returnDocument: 'after' }
  );
  return doc.count <= limit;
}

async function resetLimit(key) {
  const col = await getCollection('rateLimits');
  await col.deleteOne({ _id: key });
}

/* ---------- sessions ---------- */

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i <= 0) return;
    try {
      out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    } catch (e) { /* ignore malformed cookie */ }
  });
  return out;
}

function cookieString(req, value, maxAgeSeconds) {
  const secure = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https';
  return COOKIE_NAME + '=' + value + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + maxAgeSeconds + (secure ? '; Secure' : '');
}

async function createSession(req, res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const now = new Date();
  const sessions = await getCollection('sessions');
  await sessions.insertOne({
    tokenHash: sha256(token),
    userId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + SESSION_DAYS * 86400000),
    userAgent: String(req.headers['user-agent'] || '').slice(0, 200)
  });
  res.setHeader('Set-Cookie', cookieString(req, token, SESSION_DAYS * 86400));
}

async function getSessionUser(req) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token || token.length > 100) return null;
  const sessions = await getCollection('sessions');
  const session = await sessions.findOne({ tokenHash: sha256(token), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const users = await getCollection('users');
  const user = await users.findOne({ _id: session.userId }, { projection: { username: 1 } });
  return user ? { id: String(user._id), username: user.username } : null;
}

async function destroySession(req, res) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (token && token.length <= 100) {
    const sessions = await getCollection('sessions');
    await sessions.deleteOne({ tokenHash: sha256(token) });
  }
  res.setHeader('Set-Cookie', cookieString(req, '', 0));
}

module.exports = {
  send, tooMany, serverError,
  hashPassword, verifyPassword, burnTime, validateNewCredentials,
  guardWrite, clientIp, hitLimit, resetLimit,
  createSession, getSessionUser, destroySession
};
