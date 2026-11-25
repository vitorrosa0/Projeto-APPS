const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/doacoesController");

router.get("/", ctrl.listar);
router.get("/totais", ctrl.totais);
router.get("/:id", ctrl.buscarPorId);
router.post("/", ctrl.criar);

module.exports = router;
