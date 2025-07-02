import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { PokemonCard } from '../';
import type { PokemonCardProps } from '../../types/pokemon.types';
import getHomePokemons from '../../mocks/fixtures/getHomePokemons.json';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const pokemons: PokemonCardProps[] = getHomePokemons.pokemons.slice(0, 5);

const PokemonList = () => {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const ctx = gsap.context(() => {
    const cards = gsap.utils.toArray('.pokemon-card-section');

    if (
      cards.length === 0 ||
      !cardsContainerRef.current ||
      !mainContainerRef.current
    )
      return;

    const totalScrollDistance =
      cardsContainerRef.current.scrollWidth -
      mainContainerRef.current.offsetWidth;

    gsap.to(cardsContainerRef.current, {
      x: -totalScrollDistance,
      ease: 'none',
      scrollTrigger: {
        id: 'slideID',
        trigger: mainContainerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (cards.length - 1),
        end: () => `+=${totalScrollDistance}`,
      },
    });




  }, mainContainerRef);

   return () => {
    ctx.revert();
  };
}, []);


  return (
    
    <Box ref={mainContainerRef} height="100vh" width="100%" overflow="hidden" bg="secondaryBackground" maxH="100vh">

      <Box
        ref={cardsContainerRef}
        width={`${pokemons.length * 100}%`}
        height="100vh"
        display="flex"
        flexWrap="nowrap" 
      >
        {pokemons.map((pokemon) => (
          <>
           
          <Box
            key={pokemon.id}
            className="pokemon-card-section" 
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
            alignItems="center"
            position="relative" 

            padding={10}
          > 
            <Box
              zIndex={10}
              color="textOnDark"
              w={'80%'}>
                  <h1
                className="pokemon-name"
                style={{
                  fontSize: '4em',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontFamily: 'Oswald, sans-serif',
                  color: 'transparent', 
                  WebkitTextStroke: '2px #DF433F', 
                }}
              >
                    {`#${pokemon.id} | ${pokemon.nom.toUpperCase()}`}
                  </h1>
            </Box>
      
            <PokemonCard {...pokemon} />
          </Box>
          </>
        ))}
      </Box>
    </Box>
  );
};

export default PokemonList;