import { createRoot } from 'react-dom/client'
import { BrowserRouter,Routes,Route } from "react-router";
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import theme from './styles/theme.ts';
// import './styles/normalize.css';



import App from './pages/App.tsx'

createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
)
