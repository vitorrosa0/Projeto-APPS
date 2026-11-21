const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/financeiroController");

router.get("/resumo", ctrl.resumo);

module.exports = router;
