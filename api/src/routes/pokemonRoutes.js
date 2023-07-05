const { Router } = require("express");
const { getAllPokemon, getPokemonById, createNewPokemon } = require("../controllers/getPokemon");

const server = Router();

server.get("/", async (req, res) => {
  const { name } = req.query;
  console.log(name);
  try {
    const pokemon = await getAllPokemon(name);
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

server.get("/:idPokemon", async (req, res) => {
  try {
    const { idPokemon } = req.params;
    const pokemon = await getPokemonById(idPokemon);
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

server.post("/", async (req, res) => {
  try {
    const { name, image, life, height, weight } = req.body;
    if (!name || !image || !life || !height || !weight) {
      res.status(400).send("Se necesita completar todos los campos");
    } else {
      const pokemon = await createNewPokemon(req.body);
      res.status(200).json(pokemon);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = server;
