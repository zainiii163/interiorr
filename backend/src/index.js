import app from './app.js';
import { connectDB } from './config/db.js';
import { env, assertProductionSecrets } from './config/env.js';
import { logIntegrationStatus } from './config/integrations.js';

async function start() {
  assertProductionSecrets();
  await connectDB();
  logIntegrationStatus();

  const server = app.listen(env.port, () => {
    console.log(`\n✓ Backend running on http://localhost:${env.port}`);
    console.log(`✓ API base: http://localhost:${env.port}/api/v1`);
    console.log(`✓ Environment: ${env.nodeEnv}`);
    console.log(`✓ CORS origin: ${env.frontendUrl}\n`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n[${signal}] Shutting down gracefully...`);
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('[UNHANDLED REJECTION]', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('[UNCAUGHT EXCEPTION]', err);
    shutdown('UNCAUGHT');
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
