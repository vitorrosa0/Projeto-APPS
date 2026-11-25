const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/despesasController");

router.get("/", ctrl.listar);
router.get("/totais", ctrl.totais);
router.post("/", ctrl.criar);

module.exports = router;
