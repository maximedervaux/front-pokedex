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
import { MenuBar } from './components/index.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import FavoritesPage from './pages/Favorites.tsx';

async function init() {
  
  if (false) {
    const { worker } = await import('./mocks/browser.js');
    await worker.start();
  }
const queryClient = new QueryClient()

  createRoot(document.getElementById('root')!).render(

    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <MenuBar />
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/pokedex" element={<PokedexPage />} />
              <Route path="/pokemon/:id" element={<PokemonDetailsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              {/* <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} /> */}
            </Routes>
         </AuthProvider>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

init();
