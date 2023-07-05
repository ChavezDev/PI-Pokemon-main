const axios = require("axios");
const { Pokemon, Type } = require("../db");

const getPokemonFromApi = async () => {
  try {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=200`);

    const urlPokemon = data.results;

    let PokemonList = urlPokemon.map(async (pokemon) => {
      const { data } = await axios.get(pokemon.url);
      let life = data.stats.find((stat) => stat.stat.name === "hp").base_stat;
      let attack = data.stats.find(
        (stat) => stat.stat.name === "attack"
      ).base_stat;
      let defense = data.stats.find(
        (stat) => stat.stat.name === "defense"
      ).base_stat;
      let speed = data.stats.find(
        (stat) => stat.stat.name === "speed"
      ).base_stat;

      let typeList = data.hasOwnProperty("types")
        ? data.types.map((t) => t.type.name)
        : [];

      let reorderPokemon = {
        id: data.id,
        name: data.name,
        image: data.sprites.other.dream_world.front_default,
        life: life,
        type: typeList,
        attack: attack,
        defense: defense,
        speed: speed,
        height: data.height,
        weight: data.weight,
        from: "API_POKEMON",
      };

      return reorderPokemon;
    });
    return Promise.all(PokemonList);
  } catch (error) {
    console.error("getPokemonFromApi: ", error.message);
  }
};

const getPokemonFromBD = async () => {
  try {
    const pokemonBD = await Pokemon.findAll({
      include: {
        model: Type,
        through: {
          attribute: [],
        },
      },
    });

    if (pokemonBD.length > 0) {
      let pokemonList = await pokemonBD.map((pokemon) => {
        let pokemonTypes = pokemon.types.map((t) => t.name);

        let reorderPokemon = {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.image,
          life: pokemon.life,
          types: pokemonTypes,
          attack: pokemon.attack,
          defense: pokemon.defense,
          speed: pokemon.speed,
          height: pokemon.height,
          weight: pokemon.weight,
          from: "BD_POKEMON",
        };
        return reorderPokemon;
      });
      return pokemonList;
    } else {
      return [];
    }
  } catch (error) {
    console.error("getPokemonFromBD: ", error.message);
  }
};

const getAllPokemon = async (namePokemon) => {
  const pokemonFromApi = await getPokemonFromApi();
  const pokemonFromBD = await getPokemonFromBD();

  const allPokemon = [...pokemonFromApi, ...pokemonFromBD];

  return namePokemon
    ? allPokemon.filter((pokemon) => {
        return (
          pokemon.name.toLowerCase().search(namePokemon.toLowerCase()) >= 0
        );
      })
    : allPokemon;
};

const getPokemonById = async (idPokemon) => {
  try {
    const pokemons = await getAllPokemon();
    const pokemon = pokemons.find(
      (pokemon) => pokemon.id.toString() === idPokemon.toString()
    );
    return pokemon || false;
  } catch (error) {
    console.error("getPokemonById:", error.message);
  }
};

const createNewPokemon = async (pokemon) => {
  const { name, image, life, types, attack, defense, speed, height, weight } =
    pokemon;
  try {
    const newPokemon = await Pokemon.create({
      name,
      image,
      life,
      attack,
      defense,
      speed,
      height,
      weight,
    });

    types.length
      ? types.map(async (t) => {
          const type = await Type.findOne({
            attributes: ["id"],
            where: { name: t },
          });
          await newPokemon.addType(type.id);
        })
      : [];
      return newPokemon;
  } catch (error) {
    console.error("createNewPokemon:", error.message);
  }
};

module.exports = { getAllPokemon, getPokemonById, createNewPokemon };
