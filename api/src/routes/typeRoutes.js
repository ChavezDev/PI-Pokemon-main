const { Router } = require("express");
const getType = require("../controllers/getType");

const server = Router();

server.get("/", async (req, res) => {
  try {
    const typeList = await getType();
    res.status(200).json(typeList);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

module.exports = server;
