const jwt = require("jsonwebtoken");

// Em produção isso viria do .env (JWT_SECRET). Para um protótipo
// acadêmico um valor padrão já resolve.
const JWT_SECRET = process.env.JWT_SECRET || "sjpa-dev-secret";

/**
 * Exige um token JWT válido no cabeçalho Authorization: Bearer <token>.
 * Sem token, ou com token inválido ou expirado, responde 401.
 * Reutilizável por qualquer módulo: router.use(exigirLogin).
 */
function exigirLogin(req, res, next) {
  const [esquema, token] = (req.get("authorization") || "").split(" ");
  if (esquema !== "Bearer" || !token) return res.status(401).json({ erro: "Faça login para continuar." });
  try {
    const { id, email } = jwt.verify(token, JWT_SECRET);
    req.usuario = { id, email };
    next();
  } catch {
    res.status(401).json({ erro: "Sessão expirada ou inválida. Faça login novamente." });
  }
}

module.exports = { JWT_SECRET, exigirLogin };
