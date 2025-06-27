import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import pokemonLogo from '@/assets/Pokemon 16 BIT.svg';
import '@/styles/App.css';

import { MenuBar,PokemonCard } from '../components';
import { Box } from '@chakra-ui/react';

function App() {
  const bgRef = useRef(null);

  useEffect(() => {
    const anim = gsap.to(bgRef.current, {
      y: -20,          
      duration: 3,    
      ease: "sine.inOut",
      yoyo: true,      
      repeat: -1,      
    });

    return () => { anim.kill(); };  
  }, []); 

  return (
    <>
      <MenuBar />
      <div className='hero'>
        <div ref={bgRef} className="hero-bg"></div>
        <div className="hero-content">
          <img src={pokemonLogo} alt="Pokemon Logo" className="logo" />
        </div>
      </div>

     <Box
        display='flex'
        flexWrap='wrap'
        justifyContent='center'
        gap='20px'
        padding='20px'
        bg='secondaryBackground' 
        minH="100vh" 
      >
        <PokemonCard
          name="Pikachu"
          image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          types={['electric']} 
          id={25}
        />
        <PokemonCard
          name="Bulbasaur"
          image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
          types={['grass', 'poison']} 
          id={1}/>
        <PokemonCard
          name="Charmander"
          image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
          types={['fire']} 
          id={4}/>

         
      
      </Box>

    </>
  );
}

export default App;
