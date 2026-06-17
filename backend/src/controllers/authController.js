const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Em produção isso viria do .env (JWT_SECRET). Para um protótipo
// acadêmico um valor padrão já resolve.
const JWT_SECRET = process.env.JWT_SECRET || "sjpa-dev-secret";

async function registrar(req, res, next) {
  try {
    const { nome, email, telefone, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, email e senha são obrigatórios" });
    }
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(409).json({ erro: "Email já cadastrado" });

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, telefone, senhaHash },
    });

    const token = gerarToken(usuario);
    res.status(201).json({ token, usuario: semSenha(usuario) });
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(401).json({ erro: "Credenciais inválidas" });

    const confere = await bcrypt.compare(senha, usuario.senhaHash);
    if (!confere) return res.status(401).json({ erro: "Credenciais inválidas" });

    const token = gerarToken(usuario);
    res.json({ token, usuario: semSenha(usuario) });
  } catch (e) { next(e); }
}

function gerarToken(usuario) {
  return jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function semSenha(usuario) {
  const { senhaHash, ...resto } = usuario;
  return resto;
}

module.exports = { registrar, login };
