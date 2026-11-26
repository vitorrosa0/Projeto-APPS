const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/animaisController");
const movimentacoes = require("../controllers/movimentacoesController");

router.use('/fotos', express.static(require('../animalPhotos').directory, { dotfiles: 'deny', setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff') }));
function validarId(req, res, next, value) {
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) return res.status(400).json({ erro: 'ID inválido' });
  next();
}
router.param('id', validarId);
router.param('movId', validarId);
router.get("/", ctrl.listar);
router.get("/:id", ctrl.buscarPorId);
router.post("/", ctrl.criar);
router.put("/:id", ctrl.atualizar);
router.delete("/:id", ctrl.remover);

router.get("/:id/movimentacoes", movimentacoes.listar);
router.post("/:id/movimentacoes", movimentacoes.criar);
router.put("/:id/movimentacoes/:movId", movimentacoes.atualizar);
router.delete("/:id/movimentacoes/:movId", movimentacoes.remover);

module.exports = router;
