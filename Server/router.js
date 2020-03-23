const express = require("express");
const router = express.Router();

const peliculasRoutes = require("./routes/peliculas");


router.use("/peliculas", peliculasRoutes);


module.exports = router;