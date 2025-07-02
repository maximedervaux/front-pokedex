import {
  Box,
  Spinner,
  Text,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import type { PokemonCardProps } from '../types/pokemon.types';
import { fetchFavPokemons } from '../api/user.api';

export default function FavoritesPage() {
  const toast = useToast();


  const {
    data,
    isError,
    isLoading,
    isFetching,
  } = useQuery<PokemonCardProps[]>({
    queryKey: ['favPokemons'],
    queryFn: () => fetchFavPokemons(),
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Erreur de chargement',
        description: `Impossible de charger les Pokémon favoris.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isError, toast]);

  return (
    <Box p={10} background="secondaryBackground" minH="100vh">
      <Heading size="lg" mb={6} textAlign="center" color="primaryAction">
        Mes Pokémon favoris
      </Heading>

      {isLoading ? (
        <Box textAlign="center">
          <Spinner />
        </Box>
      ) : (
        <>
          {data && data.length === 0 ? (
            <Text fontSize="lg" textAlign="center" color="gray.500">
              Vous n'avez pas encore ajouté de Pokémon à vos favoris.
            </Text>
          ) : (
            <Box
              gap="40px"
              alignItems="center"
              justifyContent="center"
              display="flex"
              flexWrap="wrap"
            >
              {data?.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  nom={pokemon.nom}
                  hires={pokemon.hires}
                  type={pokemon.type}
                  id={pokemon.id}
                />
              ))}
            </Box>
          )}

          {isFetching && !isLoading && (
            <Text mt={4} fontSize="sm" textAlign="center">
              Chargement des données...
            </Text>
          )}

         
        </>
      )}
    </Box>
  );
}
