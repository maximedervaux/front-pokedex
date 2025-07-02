import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PokemonCard from './PokemonCard'; // Adjust path as needed
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@testing-library/jest-dom'; // For extended matchers like .toBeInTheDocument()

// Mock gsap since we're not testing animations directly in this unit test
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
  },
}));

// Mock useToken from @chakra-ui/react to control color output
vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@chakra-ui/react')>();
  return {
    ...actual,
    useToken: vi.fn((_colors, tokens) => {
      // Simulate useToken returning a hex color for any requested token
      const mockColors: Record<string, string> = {
        typeFire: '#FF4500', // Example red for fire
        gray500: '#718096', // Example gray
        // Add more mock colors if needed for other types you might test
      };
      return tokens.map((token: string) => mockColors[token.replace('.', '')] || '#000000');
    }),
  };
});

// A minimal Chakra UI theme for testing purposes, if your component relies on it
const testTheme = extendTheme({
  colors: {
    pokemon: {
      red: '#EE1515',
    },
    typeFire: '#FF4500',
    // Add other type colors if needed for comprehensive testing
  },
});

describe('PokemonCard', () => {
  const defaultProps = {
    nom: 'Charmander',
    hires: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    type: ['Fire'],
    id: 4,
  };

  // Helper function to render the component within ChakraProvider
  const renderComponent = (props = {}) => {
    return render(
      <ChakraProvider theme={testTheme}>
        <PokemonCard {...defaultProps} {...props} />
      </ChakraProvider>
    );
  };

  it('renders the Pokemon name', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /charmander/i })).toBeInTheDocument();
  });

  it('renders the Pokemon ID with leading zeros', () => {
    renderComponent();
    expect(screen.getByText('#004')).toBeInTheDocument();
  });

  it('renders the Pokemon image with correct alt text', () => {
    renderComponent();
    const pokemonImage = screen.getByAltText(/charmander/i);
    expect(pokemonImage).toBeInTheDocument();
    expect(pokemonImage).toHaveAttribute('src', defaultProps.hires);
  });

  it('renders all Pokemon types as tags', () => {
    renderComponent({ type: ['Fire', 'Flying'] });
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Flying')).toBeInTheDocument();
  });

  it('renders the primary type icon', () => {
    renderComponent();
    const typeIcon = screen.getByAltText(/fire/i);
    expect(typeIcon).toBeInTheDocument();
    expect(typeIcon).toHaveAttribute('src', '/types/fire.svg');
  });

  it('generates the correct link for the card', () => {
    renderComponent();
    const linkElement = screen.getByRole('link', { name: /charmander/i }).closest('a');
    expect(linkElement).toHaveAttribute('href', '/pokemon/4');
  });
});