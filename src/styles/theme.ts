import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    primary: '#E53E3E', // Un rouge 
    secondary: '#2D3748', // Un gris foncé pour les arrière-plans sombres
    light: '#F7FAFC', // Un gris très clair pour les arrière-plans clairs
    white: '#FFFFFF', // Blanc pur
  },
  // Couleurs neutres ou secondaires pour les arrière-plans et textes divers
  neutral: {
    dark: '#1D1D1D', // Noir profond
    medium: '#222222', // Gris très foncé
    light: '#A0AEC0', // Un gris plus doux pour certains textes ou bordures
  },
  // Couleurs spécifiques aux types de Pokémon
  pokemon: {
    // Couleurs de base de Pokémon (peut-être pas utilisées directement pour le thème global)
    red: '#E53E3E', // Dupliqué ici pour être explicite si besoin
    darkGray: '#2D3748', // Dupliqué ici
    lightGray: '#F7FAFC', // Dupliqué ici
    white: '#FFFFFF', // Dupliqué ici

    // Couleurs des types de Pokémon
    green: '#48BB78', // Grass
    blue: '#3182CE', // Water
    purple: '#805AD5', // Psychic (ou General Purple)
    normal: '#A8A77A',
    fire: '#EE8130',
    electric: '#F7D02C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    psychicType: '#F95587', // Spécifique pour Psychic si 'purple' est générique
  },
};

const semanticTokens = {
  colors: {
    // --- Rôles principaux du thème ---
    primaryAction: {
      default: 'brand.primary', 
      _dark: 'brand.primary',
    },
    background: {
      default: 'brand.light', 
      _dark: 'neutral.dark', 
    },
    cardBackground: {
      default: 'brand.secondary', 
      _dark: 'neutral.medium', 
    },
    textOnDark: {
      default: 'brand.white',
      _dark: 'brand.white',
    },
    textOnLight: {
      default: 'brand.secondary', 
      _dark: 'brand.light',
    },
    secondaryBackground: {
      default: 'neutral.dark',
      _dark: 'neutral.dark',
    },
    secondaryBackground2: {
      default: 'neutral.medium',
      _dark: 'neutral.medium',
    },
    secondaryText: {
      default: 'neutral.light',
      _dark: 'neutral.light',
    },

    // --- Couleurs sémantiques par type de Pokémon (restent dans 'pokemon') ---
    typeGrass: 'pokemon.green',
    typeWater: 'pokemon.blue',
    typePsychic: 'pokemon.psychicType',
    typeNormal: 'pokemon.normal',
    typeFire: 'pokemon.fire',
    typeElectric: 'pokemon.electric',
    typeIce: 'pokemon.ice',
    typeFighting: 'pokemon.fighting',
    typePoison: 'pokemon.poison',
    typeGround: 'pokemon.ground',
    typeFlying: 'pokemon.flying',
    typeBug: 'pokemon.bug',
    typeRock: 'pokemon.rock',
    typeGhost: 'pokemon.ghost',
    typeDragon: 'pokemon.dragon',
  },
};

const components = {
  Text: {
    baseStyle: {
      color: 'textOnLight', 
    },
  },
  Heading: {
    baseStyle: {
      color: 'textOnLight', 
    },
  },
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'md',
    },
    variants: {
      primary: {
        bg: 'primaryAction',
        color: 'textOnDark',
        _hover: {
          opacity: 0.9,
        },
      },
      secondary: {
        bg: 'secondaryBackground',
        color: 'textOnDark',
        _hover: {
          opacity: 0.9,
        },
      },

    }},
    };



const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  colors,
  semanticTokens,
  components,
  config,
});

export default theme;