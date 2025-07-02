import {
  Box,
  Spinner,
  Text,
  HStack,
  IconButton,
  useToast,
  Input,
  Heading,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import type { PokemonCardProps } from '../types/pokemon.types';
import { fetchFavPokemons } from '../api/user.api';

export default function FavoritesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [inputLimit, setInputLimit] = useState(10);
  const lastValidPage = useRef(1);
  const toast = useToast();

  const {
    data,
    isError,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: [page, limit],
    queryFn: () => fetchFavPokemons({ page, limit }),
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 0,
  });

  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Erreur de chargement',
        description: `Impossible de charger la page ${page}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setPage(lastValidPage.current);
    } else if (data) {
      lastValidPage.current = page;
    }
  }, [isError, data, page, toast]);

  return (
    <Box p={10} background="secondaryBackground" minH="100vh">
      <Heading
        size="lg"
        mb={6}
        textAlign="center"
        color="primaryAction"
      >
        Mes Pokémon favoris
      </Heading>

      {isPending ? (
        <Box textAlign="center">
          <Spinner />
        </Box>
      ) : (
        <>
          {data?.length === 0 ? (
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
              {data.map((pokemon: PokemonCardProps) => (
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

          {isFetching && (
            <Text mt={4} fontSize="sm" textAlign="center">
              Chargement des données...
            </Text>
          )}

          <HStack mt={6} spacing={4} justify="center">
            <Input
              type="number"
              value={inputLimit}
              min={1}
              max={100}
              width="100px"
              color={'primaryAction'}
              backgroundColor="PrimaryBackground"
              onChange={(e) => setInputLimit(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (inputLimit > 0 && inputLimit <= 100) {
                    setPage(1);
                    setLimit(inputLimit);
                  } else {
                    toast({
                      title: 'Limite invalide',
                      description: 'Veuillez entrer un nombre entre 1 et 100.',
                      status: 'warning',
                      duration: 4000,
                      isClosable: true,
                    });
                  }
                }
              }}
            />

            <IconButton
              icon={<ChevronLeftIcon />}
              aria-label="Page précédente"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              isDisabled={page === 1}
            />
            <Text color="primaryAction" fontSize="sm">
              Page {page} sur {totalPages}
            </Text>
            <IconButton
              icon={<ChevronRightIcon />}
              aria-label="Page suivante"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              isDisabled={page === totalPages}
            />
          </HStack>
        </>
      )}
    </Box>
  );
}
