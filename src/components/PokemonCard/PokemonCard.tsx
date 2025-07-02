import React, { useRef, useEffect } from 'react';
import { Box, VStack, Image, Heading, Text, HStack, Tag, Square } from '@chakra-ui/react';
import { useToken } from '@chakra-ui/react'; 
import gsap from 'gsap';
import type { PokemonCardProps } from '../../types/pokemon.types';
import { Link } from 'react-router-dom';


const typeBaseColorTokenMap = {
    normal: 'typeNormal',
    fire: 'typeFire',
    water: 'typeWater',
    grass: 'typeGrass',
    electric: 'typeElectric',
    ice: 'typeIce',
    fighting: 'typeFighting',
    poison: 'typePoison',
    ground: 'typeGround',
    flying: 'typeFlying',
    psychic: 'typePsychic',
    bug: 'typeBug',
    rock: 'typeRock',
    ghost: 'typeGhost',
    dragon: 'typeDragon',
};
type TypeBaseColorKey = keyof typeof typeBaseColorTokenMap;

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, ((num >> 16) - ((percent / 100) * 255)) | 0);
  const g = Math.max(0, (((num >> 8) & 0x00FF) - ((percent / 100) * 255)) | 0);
  const b = Math.max(0, ((num & 0x0000FF) - ((percent / 100) * 255)) | 0);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}


const PokemonCard: React.FC<PokemonCardProps> = ({ nom, hires, type, id }) => {
    const primaryType = type[0]?.toLowerCase();
    const baseColorTokenName = typeBaseColorTokenMap[primaryType as TypeBaseColorKey] || 'gray.500';
    const [primaryColorHex] = useToken('colors', [baseColorTokenName]);
    const darkColorHex = darkenColor(primaryColorHex, 20);
    const cardBgGradient = `linear(to-b, ${primaryColorHex}, ${darkColorHex})`;
    const tagBgColor = primaryColorHex;


    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const tagRef = useRef<HTMLDivElement>(null);


    const cardWidths = {
        base: "150px",
        sm: "180px",
        md: "220px",
        lg: "270px",
        xl: "320px"
    };

    const cardHeights = {
        base: `${parseFloat(cardWidths.base) * 1.618}px`,
        sm: `${parseFloat(cardWidths.sm) * 1.618}px`,
        md: `${parseFloat(cardWidths.md) * 1.618}px`,
        lg: `${parseFloat(cardWidths.lg) * 1.618}px`,
        xl: `${parseFloat(cardWidths.xl) * 1.618}px`,
    };


    useEffect(() => {
        const card = cardRef.current;

        const handleMouseMove = (e: MouseEvent) => {
        const rect = card!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -(y - centerY) / 100;
        const rotateY = (x - centerX) / 100;

        gsap.to(card, {
            rotateX,
            rotateY,
            scale: 1.03,
            transformPerspective: 800,
            transformOrigin: 'center',
            ease: 'power2.out',
            duration: 0.3,
        });

        gsap.to(imageRef.current, {
            x: (x - centerX) / 30,
            y: (y - centerY) / 30,
            ease: 'power2.out',
            duration: 0.3,
        });

        gsap.to(tagRef.current, {
            x: (x - centerX) / 20,
            y: (y - centerY) / 20,
            ease: 'power2.out',
            duration: 0.3,
        });
        };

        const handleMouseLeave = () => {
        gsap.to([card, imageRef.current, tagRef.current], {
            rotateX: 0,
            rotateY: 0,
            x: 0,
            y: 0,
            scale: 1,
            ease: 'power3.out',
            duration: 0.5,
        });
        };

        card!.addEventListener('mousemove', handleMouseMove);
        card!.addEventListener('mouseleave', handleMouseLeave);

        return () => {
        card!.removeEventListener('mousemove', handleMouseMove);
        card!.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);




    return (
        <Link to={`/pokemon/${id}`}>
            <Box
                bg="pokemon.red"
                borderRadius="lg"
                boxShadow="xl"
                width={cardWidths}
            height={cardHeights}
            display="flex"
            alignItems="center"
            justifyContent="center"
            margin={0}
            padding={0}
            position="relative"
            ref={cardRef}
       
        >
                <Text
                    position="absolute"
                    top={"-10px"} 
                    right={{base: "20px",md:"45px"}}
                    bg="white"
                    p={{ base: "2px 5px", md: "5px 10px" }} 
                    borderRadius="md" 
                    fontSize={{ base: "xs", md: "lg", lg:"lg" }} 
                    fontWeight="bold"
                    zIndex="1" 
                    textAlign="center" 
                    whiteSpace="nowrap" 

                    ref={tagRef}
                >
                    #{String(id).padStart(3, '0')}
                </Text>

                <Square
                    position="absolute"
                    top={"0px"} 
                    left={"0px"} 
                    size={{ base: "20px", sm: "30px", md: "40px", lg: "50px", xl: "60px" }}
                    aspectRatio={1}
                    bg="primaryAction"
                    zIndex="1"
                    boxShadow="md"
                    borderColor="gray.800"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderBottomRightRadius={"lg"} 
                    borderTopLeftRadius={"lg"} 
                    
                >
                    <Image  src={`/types/${primaryType.toLowerCase()}.svg`} alt={primaryType} boxSize="100%" />
                            
                </Square>

                <Box
                    bgGradient={cardBgGradient} 
                    width="96%"
                    height="96%"
                    borderRadius="md" 
                    p={4} 
                    color="textOnDark"
                    display="flex"
                    >
                    <VStack spacing={3} width="100%" height="100%" justifyContent="space-between">
                        <Image
                            ref={imageRef}
                            src={hires}
                            alt={nom}
                            boxSize={'90%'}
                            objectFit="contain"
                            mt={{ base: 4, md: 6 }} 
                            filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))"
                        />
                        <Heading as="h3" size={"lg"} textAlign="center" flexGrow={1} display="flex" alignItems="center" justifyContent="center" color={"textOnDark"}>
                            {nom}
                        </Heading>
                        <HStack wrap="wrap" justifyContent="center" mt={2}>
                            {type.map((type) => (
                                <Tag key={type} size={{ base: "sm", md: "md" }} variant="solid" bg={tagBgColor}>
                                    {type}
                                </Tag>
                            ))}
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </Link>
    );


  



};

export default PokemonCard;