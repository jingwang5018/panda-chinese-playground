const { getCollection } = require('../_lib/db');
const {
  send, tooMany, serverError, verifyPassword, burnTime,
  guardWrite, clientIp, hitLimit, resetLimit, createSession
} = require('../_lib/auth');

const GENERIC_ERROR = '用户名或密码不对，请再检查一下';

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(res, 405, { error: 'method not allowed' });
    }
    if (!guardWrite(req, res)) return;

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!username || !password || username.length > 40 || password.length > 128) {
      return send(res, 400, { error: '请输入用户名和密码' });
    }

    const usernameLower = username.toLowerCase();
    const userKey = 'login:user:' + usernameLower;
    const ipAllowed = await hitLimit('login:ip:' + clientIp(req), 40, 900);
    const userAllowed = await hitLimit(userKey, 8, 900);
    if (!ipAllowed || !userAllowed) {
      return tooMany(res, '尝试次数太多了，请 15 分钟后再试');
    }

    const users = await getCollection('users');
    const user = await users.findOne({ usernameLower });
    if (!user) {
      await burnTime(password);
      return send(res, 401, { error: GENERIC_ERROR });
    }
    if (!(await verifyPassword(password, user.passwordHash))) {
      return send(res, 401, { error: GENERIC_ERROR });
    }

    await resetLimit(userKey);
    await users.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
    await createSession(req, res, user._id);
    return send(res, 200, { user: { id: String(user._id), username: user.username } });
  } catch (err) {
    return serverError(res, err);
  }
};
