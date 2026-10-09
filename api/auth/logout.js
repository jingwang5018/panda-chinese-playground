const { send, serverError, guardWrite, destroySession } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(res, 405, { error: 'method not allowed' });
    }
    if (!guardWrite(req, res)) return;
    await destroySession(req, res);
    return send(res, 200, { ok: true });
  } catch (err) {
    return serverError(res, err);
  }
};
