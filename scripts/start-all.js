import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('\n🚀 Iniciando Chopits Fullstack (Backend JSON-Server + Frontend Vite)...\n');

const serverProc = spawn('node', ['scripts/start-server.js'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

const viteProc = spawn('npx', ['vite'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  serverProc.kill();
  viteProc.kill();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
