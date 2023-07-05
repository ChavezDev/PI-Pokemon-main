const axios = require("axios");
const { Type } = require("../db");

const getType = async () => {
  try {
    const typeFromBD = await Type.findAll();

    if (typeFromBD.length > 0) {
      return [...typeFromBD].sort();
    }

    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=200`);
    const pokemonUrls = data.results.map((pokemon) => pokemon.url);

    const pokemonList = await Promise.all(
      pokemonUrls.map(async (url) => {
        const { data } = await axios.get(url);
        return data;
      })
    );

    const typeFromApi = new Set();

    pokemonList.forEach((pokemon) => {
      if (pokemon.types) {
        pokemon.types.forEach((type) => typeFromApi.add(type.type.name));
      }
    });

    const typeListSort = Array.from(typeFromApi).sort();
    const typeListObjet = typeListSort.map((type) => ({ name: type }));

    const typeInsert = await Type.bulkCreate(typeListObjet);
    return typeInsert;
  } catch (error) {
    console.error("getType: ", error.message);
  }
};

module.exports = getType;
