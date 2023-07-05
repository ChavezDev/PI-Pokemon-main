const { Router } = require("express");

const pokemon = require("./pokemonRoutes");
const type = require("./typeRoutes");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/pokemon", pokemon);
router.use("/type", type);

module.exports = router;
