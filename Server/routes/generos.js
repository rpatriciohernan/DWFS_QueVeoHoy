const express = require("express");
const router = express.Router();

const generosController = require("../controllers/generosController");
const controller = new generosController();

router.get("/", controller.getGeneros);

module.exports = router;