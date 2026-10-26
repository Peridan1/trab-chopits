import net from 'node:net';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const rawPort = process.env.PORT;

if (!rawPort || rawPort.trim() === "") {
  console.error('\n❌ [Configuração Obrigatória Ausente]: A variável de ambiente "PORT" não foi informada!');
  console.error('Defina PORT no seu arquivo .env ou no ambiente de execução.\n');
  process.exit(1);
}

const targetPort = parseInt(rawPort, 10);
if (isNaN(targetPort)) {
  console.error(`\n❌ [Valor Inválido]: O valor da porta "${rawPort}" não é um número inteiro válido!\n`);
  process.exit(1);
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '0.0.0.0');
  });
}

async function startServer() {
  const available = await isPortAvailable(targetPort);
  if (!available) {
    console.error(`\n❌ [Conflito de Porta]: A porta ${targetPort} configurada já está ocupada por outro processo!`);
    console.error('O sistema encerrou para evitar conflito. Encerre o processo anterior ou altere a variável PORT no .env.\n');
    process.exit(1);
  }

  console.log(`\n🚀 Iniciando JSON-Server estritamente na porta: ${targetPort}\n`);

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
