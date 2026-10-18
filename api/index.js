let createServer;
try {
  createServer = require('../apps/api/dist/apps/api/src/server.js').createServer;
} catch (e) {
  createServer = require('../apps/api/dist/server.js').createServer;
}

const app = createServer();

module.exports = app;
