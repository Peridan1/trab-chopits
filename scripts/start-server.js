import net from 'node:net';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const DEFAULT_PORT = parseInt(process.env.PORT || '3001', 10);
const MAX_PORT_ATTEMPTS = 10;

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

async function findAvailablePort(startPort) {
  for (let offset = 0; offset < MAX_PORT_ATTEMPTS; offset++) {
    const port = startPort + offset;
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
  }
  return startPort;
}

async function startServer() {
  const port = await findAvailablePort(DEFAULT_PORT);
  console.log(`\n🚀 Iniciando JSON-Server na porta: ${port}`);
  if (port !== DEFAULT_PORT) {
    console.log(`⚠️  A porta ${DEFAULT_PORT} estava ocupada, usando a porta livre ${port} automaticamente.\n`);
  }

  const jsonServerArgs = [
    'json-server',
    'jsonserver/dados.json',
    '--port',
    port.toString()
  ];

  const child = spawn('npx', jsonServerArgs, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (err) => {
    console.error('Erro ao iniciar o JSON-Server:', err);
    process.exit(1);
  });
}

startServer();
