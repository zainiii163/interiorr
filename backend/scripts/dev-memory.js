/**
 * Local-only: in-memory MongoDB → seed → run API with --watch
 * Use when Docker / local MongoDB is not installed.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn, spawnSync } from 'child_process';

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri('interior_platform');

console.log(`In-memory MongoDB ready`);
console.log(`URI: ${uri}`);

const env = { ...process.env, MONGODB_URI: uri };

console.log('Seeding database...');
const seed = spawnSync(process.execPath, ['src/seed/seed.js'], {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
});

if (seed.status !== 0) {
  console.error('Seed failed');
  await mongod.stop();
  process.exit(seed.status ?? 1);
}

console.log('Starting API server...');
const child = spawn(process.execPath, ['--watch', 'src/index.js'], {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
});

const shutdown = async () => {
  child.kill('SIGTERM');
  await mongod.stop();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

child.on('exit', async (code) => {
  await mongod.stop();
  process.exit(code ?? 0);
});
