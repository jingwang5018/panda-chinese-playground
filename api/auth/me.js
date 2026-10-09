const { send, serverError, getSessionUser } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return send(res, 405, { error: 'method not allowed' });
    }
    const user = await getSessionUser(req);
    if (!user) return send(res, 401, { error: 'unauthorized' });
    return send(res, 200, { user });
  } catch (err) {
    return serverError(res, err);
  }
};
