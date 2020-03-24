const express = require("express");
const router = express.Router();

const peliculasRoutes = require("./routes/peliculas");
const generosRoutes = require("./routes/generos");


router.use("/peliculas", peliculasRoutes);
router.use("/generos", generosRoutes);


module.exports = router;