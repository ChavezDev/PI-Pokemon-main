const axios = require("axios");
//const { Pokemon, Type } = require("../db");

const getPokemonFromApi = async () => {
  try {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon`);

    const urlPokemon = data.results

    let PokemonList = urlPokemon.map(async (pokemon) => {
      const { data } = await axios.get(pokemon.url)
        let life = data.stats.find( stat => stat.stat.name === "hp").base_stat
        let attack = data.stats.find( stat => stat.stat.name === "attack").base_stat
        let defense = data.stats.find( stat => stat.stat.name === "defense").base_stat
        let speed = data.stats.find( stat => stat.stat.name === "speed").base_stat

        let reorderPokemon = {
            id: data.id,
            name: data.name,
            image:data.sprites.other.dream_world.front_default,
            life:life,
            attack:attack,
            defense: defense,
            speed:speed,
            height:data.height,
            weight:data.weight,
            from: "API_POKEMON"
        }
        
        return reorderPokemon;
    })
        return Promise.all(PokemonList);
  } catch (error) {
    console.error("getPokemonFromApi: ", error.message);
  }
};

const getAllPokemon = async (namePokemon) => {
  const pokemonFromApi = await getPokemonFromApi();

  const allPokemon = [...pokemonFromApi]

  return namePokemon? allPokemon.filter((pokemon) => {
    return pokemon.name.toLowerCase().search(namePokemon.toLowerCase()) >= 0;
  })
  : allPokemon;
}

module.exports = { getAllPokemon };
