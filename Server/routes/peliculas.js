const express = require("express");
const router = express.Router();

const peliculasController = require("../controllers/peliculasController");
const controller = new peliculasController();

router.get("/", controller.getPeliculas);
router.get("/:id", controller.getPeliculaById);

module.exports = router;