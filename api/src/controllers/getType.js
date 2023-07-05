const axios = require("axios");

const { Type } = require("../db");

const getType = async () => {
  try {
    const typeFromBD = await Type.findAll();

    if (typeFromBD.length > 0) {
      return [...typeFromBD].sort();
    } else {
      const typeFromApi = new Set();

      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=160`);

      const pokemonList = await Promise.all(
        data.results.map(async (pokemon) => {
          const { data } = await axios.get(pokemon.url);
          return data;
        })
      );

      pokemonList.forEach((pokemon) => {
        if (pokemon.types) {
          pokemon.types.map((type) => typeFromApi.add(type.type.name));
        }
      });

      const typeListSort = Array.from(typeFromApi).sort();

      const typeListObjet = typeListSort.map((type) => {
        return { name: type };
      });

      const typeInsert = await Type.bulkCreate(typeListObjet);

      return typeInsert;
    }
  } catch (error) {
    console.error("getType: ", error.message);
  }
};

module.exports = getType;
