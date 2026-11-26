const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/animaisController");

router.use('/fotos', express.static(require('../animalPhotos').directory, { dotfiles: 'deny', setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff') }));
router.param('id', (req, res, next, value) => {
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) return res.status(400).json({ erro: 'ID inválido' });
  next();
});
router.get("/", ctrl.listar);
router.get("/:id", ctrl.buscarPorId);
router.post("/", ctrl.criar);
router.put("/:id", ctrl.atualizar);
router.delete("/:id", ctrl.remover);

module.exports = router;
