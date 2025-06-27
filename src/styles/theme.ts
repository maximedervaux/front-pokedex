import { extendTheme } from "@chakra-ui/react"; // Pas besoin d'importer 'background' ici

const colors = {
    pokemon: {
        red: '#E53E3E',
        darkGray: '#2D3748',
        lightGray: '#F7FAFC',
        white: '#FFFFFF',

        green: '#48BB78', 
        blue: '#3182CE',  
        purple: '#805AD5', 
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
        psychicType: '#F95587', 
    },

    secondary: {
        1: '#33363A'
    }
};

const semanticTokens = {
    colors: {
        // --- Rôles principaux ---
        primaryAction: 'pokemon.red',
        background: 'pokemon.lightGray',
        cardBackground: 'pokemon.darkGray',
        textOnDark: 'pokemon.white',
        textOnLight: 'pokemon.darkGray',
        secondaryBackground: 'secondary.1',
        secondaryText: 'secondary.1',
        // --- Couleurs sémantiques par type de Pokémon ---
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

const theme = extendTheme({ colors, semanticTokens });

export default theme;