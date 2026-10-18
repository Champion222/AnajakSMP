let app;

function getApp() {
  if (!app) {
    let createServer;
    try {
      createServer = require('../apps/api/dist/server.js').createServer;
    } catch (e1) {
      try {
        createServer = require('../apps/api/dist/apps/api/src/server.js').createServer;
      } catch (e2) {
        throw new Error('Could not find server bundle: ' + e1.message);
      }
    }
    app = createServer();
  }
  return app;
}

module.exports = (req, res) => {
  try {
    const server = getApp();
    return server(req, res);
  } catch (err) {
    console.error('Vercel API Handler Error:', err);
    res.status(500).json({ error: 'Server initialization error', message: err.message });
  }
};
