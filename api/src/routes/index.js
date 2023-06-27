const { Router } = require("express");
const pokemon = require("./pokemonRoutes");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/pokemon", pokemon);

module.exports = router;
