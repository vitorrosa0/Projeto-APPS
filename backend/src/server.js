require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const animaisRoutes = require("./routes/animais");
const colaboradoresRoutes = require("./routes/colaboradores");

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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
