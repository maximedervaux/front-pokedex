import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '@/styles/App.css';
import { MenuBar } from '../components';
import { Box, Heading, HStack, Text, VStack, Image, Stack } from '@chakra-ui/react';
import PokemonList from '../components/PokemonList/PokemonList';


import pokemonLogo from '@/assets/Pokemon 16 BIT.svg';
import Team from '@/assets/team.png';
import pixelMax from '@/assets/pixelmax.png';
import pixelugo from '@/assets/pixelugo.png';

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
          <img src={Team} alt="Team" className="team" />
        </div>
      </div>

     <Box
        display='flex'
        flexWrap='wrap'
        justifyContent='center'
        alignItems='center'
        gap='20px'
        padding='20px'
        bg='secondaryBackground' 
        minH="100vh" 
      >
        <PokemonList />
      </Box>

     <Stack
      direction={{ base: "column", md: "row" }}
      m={3}
      spacing={3}
      textAlign="center"
      borderRadius="md"
      padding={4}

    >
      {/* Card 1 */}
      <Stack
        direction={{ base: "column", md: "row" }}
        backgroundColor="secondaryBackground2"
        borderRadius="lg"
        padding={4}
        align="center"
        justify="center"
        w="100%"
        spacing={6}
      >
        <Image src={pixelMax} alt="Max" h={{ base: "200px", md: "80%" }} objectFit="contain" transform="scaleX(-1)" />
        <VStack spacing={4} align="center">
          <Heading color="textOnDark">Max</Heading>
          <Text color="textOnDark">
           Frontend Developper wtf
          </Text>
        </VStack>
      </Stack>

      {/* Card 2 */}
      <Stack
        direction={{ base: "column", md: "row-reverse" }}
        backgroundColor="secondaryBackground2"
        borderRadius="lg"
        padding={4}
        align="center"
        justify="center"
        w="100%"
        spacing={6}
      >
        <Image src={pixelugo} alt="Ugo" h={{ base: "200px", md: "80%" }} objectFit="contain" />
        <VStack spacing={4} align="center">
          <Heading color="textOnDark">Ugo</Heading>
          <Text color="textOnDark">
            Backend Developper
          </Text>
        </VStack>
      </Stack>
    </Stack>

    </>
  );
}

export default App;
