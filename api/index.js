import app from '../backend/src/app.js';

export default function handler(req, res) {
  // If Vercel rewrites the URL and strips /api, add it back for Express routing
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
}
