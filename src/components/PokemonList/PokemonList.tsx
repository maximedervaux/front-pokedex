import { useEffect, useState } from 'react';
import { PokemonCard } from '../';
import { Box } from '@chakra-ui/react';
import type { PokemonCardProps } from '../../types/pokemon.types';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState<PokemonCardProps[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}pokemons`)
      .then(res => res.json())
      .then(data => setPokemons(data.pokemons));
  }, []);

  console.log('Pokemons:', pokemons);
  return (
    <Box p={4} display={'flex'} flexWrap='wrap' justifyContent='center' gap={4}>

      {pokemons.slice(0, 3).map(pokemon => (
        <PokemonCard
          key={pokemon.id}
          nom={pokemon.nom}
          hires={pokemon.hires}
          type={pokemon.type}
          id={pokemon.id}
        />
      ))}
    </Box>
  );
};

export default PokemonList;
