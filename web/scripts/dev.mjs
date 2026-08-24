import { execSync } from 'node:child_process';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const PORT = 3000;
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONFIG = fileURLToPath(new URL('../vite.config.ts', import.meta.url));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function tryBind(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once('error', () => resolve(false));
    tester.listen({ port, host: '127.0.0.1' }, () => {
      tester.close(() => resolve(true));
    });
  });
}

async function waitPortFree(port, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await tryBind(port)) return true;
    await sleep(250);
  }
  return false;
}

try {
  execSync('docker compose -f ../docker-compose.yml stop web', { stdio: 'ignore' });
} catch {}

await waitPortFree(PORT);

const { createServer } = await import('vite');
const server = await createServer({
  root: ROOT,
  configFile: CONFIG,
});

let started = false;
for (let i = 0; i < 12 && !started; i++) {
  try {
    await server.listen();
    started = true;
  } catch (err) {
    if (!String(err?.message).includes('already in use') || i === 11) throw err;
    await sleep(500);
    await server.close().catch(() => {});
  }
}

if (!started) {
  console.error(`El puerto ${PORT} sigue ocupado. Detén el proceso que lo usa e intenta de nuevo.`);
  process.exit(1);
}

server.printUrls();
