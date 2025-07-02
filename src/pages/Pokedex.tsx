import {
  Box,
  Spinner,
  Text,
  HStack,
  IconButton,
  useToast,
  Input,
  InputGroup,
  Kbd
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import type { PokemonCardProps } from '../types/pokemon.types';
import { fetchPokemonByName, fetchPokemons } from '../api/pokemon.api';
import { LuSearch } from "react-icons/lu";

export default function Pokedex() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [inputLimit, setInputLimit] = useState(10); 
  const lastValidPage = useRef(1);
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = () => {
    const trimmedSearch = searchInput.trim();
    setSearchTerm(trimmedSearch);
    setPage(1); // Reset à la page 1 pour toute nouvelle recherche
  };

  

  // Détermine si on est en mode recherche
  const isSearchMode = searchTerm.trim() !== '';

  const {
    data,
    isError,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: isSearchMode
      ? ['search-pokemon', searchTerm,page, limit]
      : ['pokemons', page, limit],
    queryFn: () => {
      if (isSearchMode) {
        return fetchPokemonByName(searchTerm, page, limit);
      }
      return fetchPokemons({ page, limit });
    },
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 0,
  });

  // Les données ont la même structure pour recherche et pagination
  const pokemonList = data?.pokemons || [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = page;

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Erreur de chargement',
        description: isSearchMode 
          ? `Pokémon "${searchTerm}" introuvable.`
          : `Impossible de charger la page ${page}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      if (!isSearchMode) {
        setPage(lastValidPage.current);
      }
    } else if (data && !isSearchMode) {
      lastValidPage.current = page;
    }
  }, [isError, data, page, searchTerm, isSearchMode, toast]);

  return (
    <Box p={10} background="secondaryBackground" minH="100vh">
      {isPending ? (
        <Box textAlign="center">
          <Spinner />
        </Box>
      ) : (
        <>
          <InputGroup mb={6} position="relative" w={['100%', '50%', '40%']} display={'flex'} justifyContent={'center'} mx={'auto'}>
            <Box as="span" position="absolute" left="0" top="0" height="100%" display="flex" alignItems="center" pl={2} color="textOnDark">
              <LuSearch />
            </Box>
            <Input 
              placeholder="Search pokemons" 
              pl="2.5em" 
              pr="3.5em" 
              color="textOnDark" 
              value={searchInput} 
              onChange={handleSearchChange} 
              onKeyDown={handleSearchKeyDown} 
            />
            <Box position="absolute" right="0" top="0" height="100%" display="flex" alignItems="center" pr={2}>
              <Kbd>Enter</Kbd>
            </Box>
          </InputGroup>

        
          <Box
            gap="40px"
            alignItems="center"
            justifyContent="center"
            display="flex"
            flexWrap="wrap"
          >
            {pokemonList.length > 0 ? (
              pokemonList.map((pokemon: PokemonCardProps) => (
                <PokemonCard
                  key={pokemon.id}
                  nom={pokemon.nom}
                  hires={pokemon.hires}
                  type={pokemon.type}
                  id={pokemon.id}
                />
              ))
            ) : (
              <Text color="textOnDark" textAlign="center">
                {isSearchMode ? 'Aucun Pokémon trouvé.' : 'Aucun Pokémon disponible.'}
              </Text>
            )}
          </Box>

          {isFetching && (
            <Text mt={4} fontSize="sm" textAlign="center" color="textOnDark">
              Chargement des données...
            </Text>
          )}

          {/* Pagination - toujours visible */}
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
              isDisabled={currentPage === 1}
            />
            <Text color="primaryAction" fontSize="sm">
              Page {currentPage} sur {totalPages}
            </Text>
            <IconButton
              icon={<ChevronRightIcon />}
              aria-label="Page suivante"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              isDisabled={currentPage === totalPages}
            />
          </HStack>
        </>
      )}
    </Box>
  );
}