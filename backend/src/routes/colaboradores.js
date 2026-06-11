const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/colaboradoresController");

router.get("/", ctrl.listar);
router.get("/:id", ctrl.buscarPorId);
router.post("/", ctrl.criar);
router.put("/:id", ctrl.atualizar);
router.delete("/:id", ctrl.remover);

router.get("/:id/contribuicoes", ctrl.listarContribuicoes);
router.post("/:id/contribuicoes", ctrl.adicionarContribuicao);

module.exports = router;
