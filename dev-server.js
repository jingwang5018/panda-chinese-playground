// Local development server: serves index.html and runs the same /api handlers Vercel runs.
// Usage: node --env-file=<file with MONGODB_URI> dev-server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3100;
const API_DIR = path.join(__dirname, 'api');
const ROUTES = {
  '/api/auth/register': 'auth/register.js',
  '/api/auth/login': 'auth/login.js',
  '/api/auth/logout': 'auth/logout.js',
  '/api/auth/me': 'auth/me.js',
  '/api/progress': 'progress.js',
  '/api/chat': 'chat.js'
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1e6) { reject(new Error('body too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function reloadHandlerCode() {
  const keep = path.join(API_DIR, '_lib', 'db.js');
  Object.keys(require.cache).forEach((file) => {
    if (file.startsWith(API_DIR) && file !== keep) delete require.cache[file];
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
    }
    if (url.pathname === '/vocab.js') {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.end(fs.readFileSync(path.join(__dirname, 'vocab.js')));
    }
    if (ROUTES[url.pathname]) {
      req.query = Object.fromEntries(url.searchParams);
      const raw = await readBody(req);
      if (raw && String(req.headers['content-type'] || '').includes('application/json')) {
        try { req.body = JSON.parse(raw); }
        catch (e) { res.statusCode = 400; return res.end('{"error":"invalid json"}'); }
      }
      res.status = function (code) { this.statusCode = code; return this; };
      res.json = function (body) {
        this.setHeader('Content-Type', 'application/json; charset=utf-8');
        this.end(JSON.stringify(body));
        return this;
      };
      reloadHandlerCode();
      return await require(path.join(API_DIR, ROUTES[url.pathname]))(req, res);
    }
    res.statusCode = 404;
    res.end('Not found');
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Server error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Local server ready: http://localhost:' + PORT + '  (collections prefix: "' + (process.env.COLLECTION_PREFIX || '') + '")');
});
