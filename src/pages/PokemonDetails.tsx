import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Spinner,
  Text,
  Heading,
  Image,
  VStack,
  HStack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  useToast,
  Menu,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { PokemonDetails } from '../types/pokemon.types';
import { MenuBar } from '../components';

const fetchPokemonById = async (id: string | undefined): Promise<PokemonDetails> => {
  if (!id) throw new Error('ID de Pokémon manquant');
  const response = await fetch(`${import.meta.env.VITE_API_URL}pokemons/${id}`);
  if (!response.ok) {
    throw new Error('Impossible de récupérer les détails du Pokémon');
  }
  return response.json();
};

export default function PokemonDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const {
  data: pokemon,
  isLoading,
  isError,
  error,
    } = useQuery<PokemonDetails>({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemonById(id),
    enabled: !!id,
    retry: false
  });

  if (isLoading) {
    return (
      <Box p={4} textAlign="center" minH="100vh" background="secondaryBackground">
        <Spinner />
      </Box>
    );
  }

  if (isError || !pokemon) {
    return (
      <Box p={4} minH="100vh">
        <Text>Impossible de charger les détails du Pokémon.</Text>
      </Box>
    );
  }

  return (
    <>
    <MenuBar/>
    <Box p={6}  minH="100vh">
      <VStack spacing={6} align="start">
        <Heading>{pokemon.nom}</Heading>
        <HStack spacing={4}>
          <Image src={pokemon.hires} alt={pokemon.nom} boxSize="200px" />
          <VStack align="start">
            <Text fontSize="lg" fontStyle="italic">{pokemon.espece}</Text>
            <Text>{pokemon.description}</Text>
            <HStack>
              {pokemon.type.map((t) => (
                  <Badge key={t} colorScheme="teal">{t}</Badge>
                ))}
            </HStack>
            <Text><b>Évolution :</b> {pokemon.evolutionNiveau}</Text>
            <Text><b>Genre :</b> {pokemon.genre}</Text>
            <Text><b>Taille :</b> {pokemon.taille} | <b>Poids :</b> {pokemon.poids}</Text>
            <Text><b>Talent Principal :</b> {pokemon.talentPrincipal}</Text>
            <Text><b>Talent Caché :</b> {pokemon.talentCache}</Text>
          </VStack>
        </HStack>

        <Heading size="md">Statistiques</Heading>
        <SimpleGrid columns={[2, 3, 6]} spacing={4} w="full">
          <Stat><StatLabel>HP</StatLabel><StatNumber>{pokemon.hp}</StatNumber></Stat>
          <Stat><StatLabel>Attaque</StatLabel><StatNumber>{pokemon.attaque}</StatNumber></Stat>
          <Stat><StatLabel>Défense</StatLabel><StatNumber>{pokemon.defense}</StatNumber></Stat>
          <Stat><StatLabel>Attaque Spé</StatLabel><StatNumber>{pokemon.attaqueSpe}</StatNumber></Stat>
          <Stat><StatLabel>Défense Spé</StatLabel><StatNumber>{pokemon.defenseSpe}</StatNumber></Stat>
          <Stat><StatLabel>Vitesse</StatLabel><StatNumber>{pokemon.vitesse}</StatNumber></Stat>
        </SimpleGrid>
      </VStack>
    </Box>
   </>
  );
}
