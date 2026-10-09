const { getCollection } = require('../_lib/db');
const {
  send, tooMany, serverError, hashPassword, validateNewCredentials,
  guardWrite, clientIp, hitLimit, createSession
} = require('../_lib/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(res, 405, { error: 'method not allowed' });
    }
    if (!guardWrite(req, res)) return;

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const problem = validateNewCredentials(body.username, body.password);
    if (problem) return send(res, 400, { error: problem });

    if (!(await hitLimit('register:ip:' + clientIp(req), 20, 3600))) {
      return tooMany(res, '注册太频繁了，请一个小时后再试');
    }

    const username = body.username.trim();
    const users = await getCollection('users');
    const now = new Date();
    let result;
    try {
      result = await users.insertOne({
        username,
        usernameLower: username.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        createdAt: now,
        lastLoginAt: now
      });
    } catch (err) {
      if (err && err.code === 11000) {
        return send(res, 409, { error: '这个用户名已经被使用了，换一个试试' });
      }
      throw err;
    }

    await createSession(req, res, result.insertedId);
    return send(res, 201, { user: { id: String(result.insertedId), username } });
  } catch (err) {
    return serverError(res, err);
  }
};
