import app from './app.js';
import { connectDB } from './config/db.js';
import { env, assertProductionSecrets } from './config/env.js';
import { logIntegrationStatus } from './config/integrations.js';

async function start() {
  assertProductionSecrets();
  await connectDB();
  logIntegrationStatus();
  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`);
    console.log(`API base: http://localhost:${env.port}/api/v1`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});