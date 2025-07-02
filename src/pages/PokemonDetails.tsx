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
  Button,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PokemonDetails } from '../types/pokemon.types';
import { useAuthContext } from '../auth/AuthContext';
import { fetchPokemonById } from '../api/pokemon.api';
import { addFavPokemon, removeFavPokemon } from '../api/user.api';

export default function PokemonDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthContext();
  const toast = useToast();
  const queryClient = useQueryClient();

  if (!id) {
    return (
      <Text color={'white'}>Veuillez sélectionner un Pokémon.</Text>
    );
  }

  const {
    data: pokemon,
    isLoading,
    isError,
  } = useQuery<PokemonDetails>({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemonById(+id),
    enabled: !!id,
    retry: false
  });

  // Mutation pour ajouter aux favoris
  const addToFavoritesMutation = useMutation({
    mutationFn: (pokemonId: number) => addFavPokemon(pokemonId),
    onSuccess: () => {
      // Invalider et refetch les données du pokémon pour mettre à jour l'état favori
      queryClient.invalidateQueries({ queryKey: ['pokemon', id] });
      
      toast({
        title: "Ajouté aux favoris !",
        description: `${pokemon?.nom} a été ajouté à vos favoris.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce Pokémon aux favoris. Veuillez réessayer.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Mutation pour retirer des favoris
  const removeFromFavoritesMutation = useMutation({
    mutationFn: (pokemonId: number) => removeFavPokemon(pokemonId),
    onSuccess: () => {
      // Invalider et refetch les données du pokémon pour mettre à jour l'état favori
      queryClient.invalidateQueries({ queryKey: ['pokemon', id] });
      
      toast({
        title: "Retiré des favoris",
        description: `${pokemon?.nom} a été retiré de vos favoris.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression des favoris:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer ce Pokémon des favoris. Veuillez réessayer.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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

  const isFavorite = pokemon.isFavori || false;
  const isUpdatingFavorite = addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending;

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavoritesMutation.mutate(pokemon.id);
    } else {
      addToFavoritesMutation.mutate(pokemon.id);
    }
  };

  return (
    <Box p={6} minH="100vh">
      <VStack spacing={6} align="start">
        <HStack justify="space-between" w="full">
          <Heading>{pokemon.nom}</Heading>
          {isAuthenticated && (
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={handleFavoriteToggle}
              isLoading={isUpdatingFavorite}
              loadingText={isFavorite ? "Suppression..." : "Ajout..."}
              disabled={isUpdatingFavorite}
            >
              {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </Button>
          )}
        </HStack>
        
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
  );
}