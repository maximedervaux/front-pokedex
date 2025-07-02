import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Alert,
  AlertIcon,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { signupUser } from '../api/auth';

export default function SignupPage() {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      const response = await signupUser(login, password);

        if (response !== 201) {
            throw new Error('Erreur lors de l\'inscription');
        }

      toast({
        title: "Inscription réussie.",
        description: "Vous pouvez maintenant vous connecter.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setLogin('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center">
            <Box maxW="md" p={6} boxShadow="md" borderRadius="md" w={['90%', '80%', '60%']}>
            <Heading mb={6} textAlign="center">Inscription</Heading>

            {error && (
                <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                <FormControl id="login" isRequired>
                    <FormLabel>Login</FormLabel>
                    <Input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    disabled={isLoading}
                    />
                </FormControl>

                <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    />
                </FormControl>

                <FormControl id="password" isRequired>
                    <FormLabel>Mot de passe</FormLabel>
                    <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    />
                </FormControl>

                <FormControl id="confirmPassword" isRequired>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    />
                </FormControl>

                <Button
                    colorScheme="red"
                    type="submit"
                    width="full"
                    isLoading={isLoading}
                    loadingText="Inscription..."
                >
                    S'inscrire
                </Button>
                </VStack>
            </form>
            </Box>
    </Box>
  );
}
