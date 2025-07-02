import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { TbPokeball } from 'react-icons/tb';
import { Link } from 'react-router';

interface LoginModalProps {
  onLogin: (credentials: { login: string; password: string }) => Promise<void>;
}

export default function LoginModal({ onLogin }: LoginModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onLogin({ login, password });
      setLogin('');
      setPassword('');
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setLogin('');
    setPassword('');
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} leftIcon={<TbPokeball />} colorScheme="red" >
        Se connecter
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connexion</ModalHeader>
          <ModalCloseButton />
      
          <form onSubmit={handleSubmit}>
            <ModalBody>
              {error && (
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <FormControl mb={4}>
                <FormLabel>Login</FormLabel>
                <Input
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Mot de passe</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </FormControl>
              <Link to="/signup" onClick={handleClose}>
                S'inscrire
              </Link>
            </ModalBody>

            
            <ModalFooter>
              <Button 
                colorScheme="red" 
                type="submit" 
                mr={3}
                isLoading={isLoading}
                loadingText="Connexion..."
                name="se connecter"
              >
                Se connecter
              </Button>
              <Button onClick={handleClose} disabled={isLoading}>
                Annuler
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}