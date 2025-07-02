import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Grid,
  GridItem
} from '@chakra-ui/react';

import type { PokemonDetails } from '../types/pokemon.types';


const pokemonTypes = [
  'Normal', 'Feu', 'Eau', 'Électrik', 'Plante', 'Glace', 'Combat', 'Poison',
  'Sol', 'Vol', 'Psy', 'Insecte', 'Roche', 'Spectre', 'Dragon', 'Ténèbres',
  'Acier', 'Fée'
];

const genres = ['87.5:12.5', '50:50', '25:75', '0:100', '100:0', 'Unknown'];

export default function PokemonForm() {
  const [formData, setFormData] = useState<Partial<PokemonDetails>>({
    id: 0,
    nom: '',
    hires: '',
    type: [],
    espece: '',
    description: '',
    evolutionNiveau: '',
    taille: '',
    poids: '',
    genre: '',
    talentPrincipal: '',
    talentCache: '',
    sprite: '',
    miniature: '',
    hp: 0,
    attaque: 0,
    defense: 0,
    attaqueSpe: 0,
    defenseSpe: 0,
    vitesse: 0,
    oeuf: ["Inconnu", "Inconnu", "Inconnu", "Inconnu"]
  });

  const [selectedType, setSelectedType] = useState('');
  const toast = useToast();

  const handleInputChange = (field: keyof PokemonDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addType = () => {
    if (selectedType && !(formData.type ?? []).includes(selectedType)) {
      setFormData(prev => ({
        ...prev,
        type: [...(prev.type ?? []), selectedType]
      }));
      setSelectedType('');
    }
  };

  const removeType = (typeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      type: (prev.type ?? []).filter(type => type !== typeToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.nom || !formData.espece || (formData.type?.length ?? 0) === 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Envoi à l'API
      const response = await fetch('http://localhost:3000/pokemons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message?.message || 'Erreur lors de l\'envoi');
      }

      const result = await response.json();
      
      toast({
        title: 'Succès',
        description: `${formData.nom} a été ajouté avec succès !`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset du formulaire
      setFormData({
        id: 0,
        nom: '',
        hires: '',
        type: [],
        espece: '',
        description: '',
        evolutionNiveau: '',
        taille: '',
        poids: '',
        oeuf: [],
        genre: '',
        talentPrincipal: '',
        talentCache: '',
        sprite: '',
        miniature: '',
        hp: 0,
        attaque: 0,
        defense: 0,
        attaqueSpe: 0,
        defenseSpe: 0,
        vitesse: 0
      });

    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de l\'envoi du Pokémon',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="800px" mx="auto" p={6}>
      <Card>
        <CardHeader>
          <Heading size="lg" textAlign="center" color="blue.600">
            Ajouter un nouveau Pokémon
          </Heading>
          <Text textAlign="center" color="gray.600" mt={2}>
            Remplissez tous les détails de votre Pokémon
          </Text>
        </CardHeader>
        
        <CardBody>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              
              {/* Informations de base */}
              <Box>
                <Heading size="md" mb={4} color="blue.500">
                  Informations de base
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>ID</FormLabel>
                      <NumberInput
                        value={formData.id}
                        onChange={(_, value) => handleInputChange('id', value || 0)}
                        min={1}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>Nom</FormLabel>
                      <Input
                        value={formData.nom}
                        onChange={(e) => handleInputChange('nom', e.target.value)}
                        placeholder="Nom du Pokémon"
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              {/* Types */}
              <Box>
                <FormLabel>Types *</FormLabel>
                <HStack mb={2}>
                  <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    placeholder="Sélectionner un type"
                    flex={1}
                  >
                    {pokemonTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                  <Button onClick={addType} colorScheme="blue" disabled={!selectedType}>
                    Ajouter
                  </Button>
                </HStack>
                <Wrap>
                  {(formData.type ?? []).map(type => (
                    <WrapItem key={type}>
                      <Tag size="lg" colorScheme="blue" variant="solid">
                        <TagLabel>{type}</TagLabel>
                        <TagCloseButton onClick={() => removeType(type)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>

              {/* Images */}
              <Box>
                <Heading size="md" mb={4} color="blue.500">
                  Images
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Image haute résolution</FormLabel>
                      <Input
                        value={formData.hires}
                        onChange={(e) => handleInputChange('hires', e.target.value)}
                        placeholder="URL de l'image HD"
                        type="url"
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Sprite</FormLabel>
                      <Input
                        value={formData.sprite}
                        onChange={(e) => handleInputChange('sprite', e.target.value)}
                        placeholder="URL du sprite"
                        type="url"
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Miniature</FormLabel>
                      <Input
                        value={formData.miniature}
                        onChange={(e) => handleInputChange('miniature', e.target.value)}
                        placeholder="URL de la miniature"
                        type="url"
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              {/* Détails */}
              <Box>
                <Heading size="md" mb={4} color="blue.500">
                  Détails
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>Espèce</FormLabel>
                      <Input
                        value={formData.espece}
                        onChange={(e) => handleInputChange('espece', e.target.value)}
                        placeholder="Espèce du Pokémon"
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Genre (Mâle:Femelle %)</FormLabel>
                      <Select
                        value={formData.genre}
                        onChange={(e) => handleInputChange('genre', e.target.value)}
                        placeholder="Sélectionner le ratio de genre"
                      >
                        {genres.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Taille</FormLabel>
                      <Input
                        value={formData.taille}
                        onChange={(e) => handleInputChange('taille', e.target.value)}
                        placeholder="ex: 1.2 m"
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Poids</FormLabel>
                      <Input
                        value={formData.poids}
                        onChange={(e) => handleInputChange('poids', e.target.value)}
                        placeholder="ex: 25.5 kg"
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Niveau d'évolution</FormLabel>
                      <Input
                        value={formData.evolutionNiveau}
                        onChange={(e) => handleInputChange('evolutionNiveau', e.target.value)}
                        placeholder="ex: Niveau 16"
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              {/* Talents */}
              <Box>
                <Heading size="md" mb={4} color="blue.500">
                  Talents
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Talent principal</FormLabel>
                      <Input
                        value={formData.talentPrincipal}
                        onChange={(e) => handleInputChange('talentPrincipal', e.target.value)}
                        placeholder="Talent principal"
                      />
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Talent caché</FormLabel>
                      <Input
                        value={formData.talentCache}
                        onChange={(e) => handleInputChange('talentCache', e.target.value)}
                        placeholder="Talent caché"
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              {/* Description */}
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description du Pokémon"
                  rows={4}
                />
              </FormControl>

              {/* Statistiques */}
              <Box>
                <Heading size="md" mb={4} color="blue.500">
                  Statistiques
                </Heading>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>HP</FormLabel>
                      <NumberInput
                        value={formData.hp}
                        onChange={(_, value) => handleInputChange('hp', value || 0)}
                        min={1}
                        max={255}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Attaque</FormLabel>
                      <NumberInput
                        value={formData.attaque}
                        onChange={(_, value) => handleInputChange('attaque', value || 0)}
                        min={1}
                        max={255}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Défense</FormLabel>
                      <NumberInput
                        value={formData.defense}
                        onChange={(_, value) => handleInputChange('defense', value || 0)}
                        min={1}
                        max={255}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Attaque Spé</FormLabel>
                      <NumberInput
                        value={formData.attaqueSpe}
                        onChange={(_, value) => handleInputChange('attaqueSpe', value || 0)}
                        min={1}
                        max={255}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Défense Spé</FormLabel>
                      <NumberInput
                        value={formData.defenseSpe}
                        onChange={(_, value) => handleInputChange('defenseSpe', value || 0)}
                        min={1}
                        max={255}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel>Vitesse</FormLabel>
                      <NumberInput
                        value={formData.vitesse}
                        onChange={(_, value) => handleInputChange('vitesse', value || 0)}
                        min={1}
                        max={255}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              {/* Options */}
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Tous les champs marqués d'un * sont obligatoires
                </Text>
              </Box>

              <Divider />

              {/* Boutons */}
              <HStack spacing={4} justify="center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({
                    id: 0,
                    nom: '',
                    hires: '',
                    type: [],
                    espece: '',
                    description: '',
                    evolutionNiveau: '',
                    taille: '',
                    poids: '',
                    oeuf: [],
                    genre: '',
                    talentPrincipal: '',
                    talentCache: '',
                    sprite: '',
                    miniature: '',
                    hp: 0,
                    attaque: 0,
                    defense: 0,
                    attaqueSpe: 0,
                    defenseSpe: 0,
                    vitesse: 0
                  })}
                >
                  Réinitialiser
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  px={8}
                >
                  Ajouter le Pokémon
                </Button>
              </HStack>
            </VStack>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}