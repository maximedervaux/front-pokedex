import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css';
import theme from './styles/theme.ts';


// Importing pages
import App from './pages/App.tsx';
import PokedexPage from './pages/Pokedex.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PokemonDetailsPage from './pages/PokemonDetails.tsx';

async function init() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser.js');
    await worker.start();
  }
const queryClient = new QueryClient()

  createRoot(document.getElementById('root')!).render(

    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>

        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/pokedex" element={<PokedexPage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailsPage />} />
          {/* <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} /> */}
        </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

init();
