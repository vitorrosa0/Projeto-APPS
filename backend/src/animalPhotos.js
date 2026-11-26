const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const directory = path.resolve(__dirname, '../uploads/animais');
const MAX_BYTES = 5 * 1024 * 1024;
function invalid(message, status = 400) { return Object.assign(new Error(message), { status }); }
function decodePhoto(value) {
  const match = typeof value === 'string' && /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) throw invalid('Use uma imagem JPEG, PNG ou WebP.');
  if (match[2].length > Math.ceil(MAX_BYTES / 3) * 4) throw invalid('A foto deve ter no máximo 5 MiB.', 413);
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > MAX_BYTES) throw invalid('A foto deve ter no máximo 5 MiB.', 413);
  const png = bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP';
  const ext = { 'image/png': png && 'png', 'image/jpeg': jpeg && 'jpg', 'image/webp': webp && 'webp' }[match[1]];
  if (!ext) throw invalid('O conteúdo da imagem não corresponde ao tipo informado.');
  return { bytes, ext };
}
async function savePhoto(value) {
  const { bytes, ext } = decodePhoto(value);
  await fs.mkdir(directory, { recursive: true });
  const name = randomUUID() + '.' + ext;
  await fs.writeFile(path.join(directory, name), bytes, { flag: 'wx' });
  return '/animais/fotos/' + name;
}
async function removePhoto(url) {
  if (!/^\/animais\/fotos\/[a-f0-9-]+\.(png|jpg|webp)$/.test(url || '')) return;
  await fs.unlink(path.join(directory, path.basename(url))).catch(error => { if (error.code !== 'ENOENT') console.error('Falha ao limpar foto:', error.code); });
}
module.exports = { directory, decodePhoto, savePhoto, removePhoto };
