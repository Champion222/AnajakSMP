import { createServer } from './server.js';
import { ENV } from './config/env.js';

const app = createServer();

const server = app.listen(ENV.PORT, () => {
  console.log('====================================================');
  console.log(`🏰 AnajakSMP API Server running on port ${ENV.PORT}`);
  console.log(`   Environment: ${ENV.NODE_ENV}`);
  console.log(`   Frontend URL: ${ENV.FRONTEND_URL}`);
  console.log(`   API Base URL: http://localhost:${ENV.PORT}/api`);
  console.log('====================================================');
});

// Handle graceful shutdown
const shutdown = () => {
  console.log('\nShutting down server gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
