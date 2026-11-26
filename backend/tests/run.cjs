// Executa as suítes do backend com um banco SQLite e uma pasta de fotos
// temporários, criados a cada execução e apagados no final. O banco de
// desenvolvimento (dev.db) e a pasta uploads/ nunca são usados.
//
// Uso: node tests/run.cjs [unit|integration]   (sem argumento: todas)
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const raiz = path.resolve(__dirname, '..');
const suites = process.argv[2] ? [process.argv[2]] : ['unit', 'integration'];

function arquivosDeTeste(pasta) {
  const dir = path.join(__dirname, pasta);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { recursive: true })
    .filter((nome) => nome.endsWith('.test.cjs'))
    .map((nome) => path.join(dir, nome))
    .sort();
}

const arquivos = suites.flatMap(arquivosDeTeste);
if (!arquivos.length) {
  console.error(`Nenhum teste encontrado em: ${suites.join(', ')}`);
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sjpa-testes-'));
const banco = path.join(tmp, 'teste.db');
if (path.resolve(banco) === path.join(raiz, 'dev.db')) throw new Error('O banco de testes não pode ser o dev.db.');

const env = { ...process.env, NODE_ENV: 'test', SQLITE_PATH: banco, UPLOADS_DIR: path.join(tmp, 'uploads'), DATABASE_URL: `file:${banco}` };

let status = 1;
try {
  if (suites.includes('integration')) {
    const prisma = path.join(raiz, 'node_modules', '.bin', process.platform === 'win32' ? 'prisma.cmd' : 'prisma');
    execFileSync(prisma, ['migrate', 'deploy'], { cwd: raiz, env, stdio: 'pipe', shell: process.platform === 'win32' });
  }
  // Serial: as suítes de integração compartilham o banco temporário.
  status = spawnSync(process.execPath, ['--test', '--test-concurrency=1', ...arquivos], { cwd: raiz, env, stdio: 'inherit' }).status ?? 1;
} catch (erro) {
  console.error(erro.stderr?.toString() || erro);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
process.exit(status);
