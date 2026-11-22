require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const animaisRoutes = require("./routes/animais");
const colaboradoresRoutes = require("./routes/colaboradores");
const voluntariosRoutes = require("./routes/voluntarios");
const doacoesRoutes = require("./routes/doacoes");
const despesasRoutes = require("./routes/despesas");
const financeiroRoutes = require("./routes/financeiro");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API SJPA funcionando!" });
});

app.use("/auth", authRoutes);
app.use("/animais", animaisRoutes);
app.use("/colaboradores", colaboradoresRoutes);
app.use("/voluntarios", voluntariosRoutes);
app.use("/doacoes", doacoesRoutes);
app.use("/despesas", despesasRoutes);
app.use("/financeiro", financeiroRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
