const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const animaisRoutes = require("./routes/animais");
const colaboradoresRoutes = require("./routes/colaboradores");
const voluntariosRoutes = require("./routes/voluntarios");

// A aplicação é montada aqui, sem abrir a porta, para que os testes de
// integração possam enviar requisições a ela. server.js faz o listen.
const app = express();

app.use(cors());
app.use('/animais', express.json({ limit: '8mb' }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API SJPA funcionando!" });
});

app.use("/auth", authRoutes);
app.use("/animais", animaisRoutes);
app.use("/colaboradores", colaboradoresRoutes);
app.use("/voluntarios", voluntariosRoutes);
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ erro: 'A foto deve ter no máximo 5 MiB.' });
  // Erros do cliente (ex.: JSON malformado) mantêm o status e a mensagem;
  // erros internos ficam só no log, sem expor detalhes ao cliente.
  const status = err.status || err.statusCode;
  if (status >= 400 && status < 500) {
    const generica = status === 404 ? 'Não encontrado.' : 'Requisição inválida.';
    return res.status(status).json({ erro: err.expose ? err.message : generica });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno no servidor. Tente novamente.' });
});

module.exports = app;
