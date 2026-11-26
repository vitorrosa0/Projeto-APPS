require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const animaisRoutes = require("./routes/animais");
const colaboradoresRoutes = require("./routes/colaboradores");
const voluntariosRoutes = require("./routes/voluntarios");

const app = express();
const PORT = process.env.PORT || 3001;

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
  console.error(err);
  res.status(500).json({ erro: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
