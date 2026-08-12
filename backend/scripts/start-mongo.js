/**
 * Start a persistent local mongod on port 27017 using the mongodb-memory-server binary.
 * Use when MongoDB is not installed as a Windows service / Docker is unavailable.
 */
import { spawn } from 'child_process';
import { mkdirSync } from 'fs';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoBinary } from 'mongodb-memory-server-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '.mongo-data');
const port = 27017;

function isPortOpen(host, portNumber) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port: portNumber });
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

const alreadyRunning = await isPortOpen('127.0.0.1', port);
if (alreadyRunning) {
  console.log(`MongoDB already listening on mongodb://127.0.0.1:${port}`);
  process.exit(0);
}

mkdirSync(dbPath, { recursive: true });

console.log('Preparing MongoDB binary (first run may download ~600MB)...');
const mongodPath = await MongoBinary.getPath();

console.log(`Starting MongoDB on mongodb://127.0.0.1:${port}`);
console.log(`Data directory: ${dbPath}`);

const mongod = spawn(mongodPath, ['--dbpath', dbPath, '--port', String(port), '--bind_ip', '127.0.0.1'], {
  stdio: 'inherit',
});

mongod.on('exit', (code) => process.exit(code ?? 0));

const shutdown = () => {
  mongod.kill('SIGTERM');
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
