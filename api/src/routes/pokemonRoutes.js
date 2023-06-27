const { Router } = require("express");
const { getAllPokemon } = require("../controllers/getPokemon");

const server = Router();

server.get("/", async (req, res) => {
  const { name } = req.query;
  console.log(name)
  try {
    const pokemon = await getAllPokemon(name);
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = server;
