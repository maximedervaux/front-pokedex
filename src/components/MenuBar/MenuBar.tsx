// MenuBar.tsx - Version complète avec gestion d'authentification
import React from 'react';
import { 
  Button, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Avatar, 
  Text,
  HStack,
  Spinner
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { LoginModal } from '..';
import { useAuthContext } from '../../auth/AuthContext';

const MenuBar: React.FC = () => {
    const { login, logout, isAuthenticated, user, isLoading } = useAuthContext();

    const handleLogin = async ({ login: loginInput, password }: { login: string; password: string }) => {
        return await login({ login: loginInput, password }); 
    }

    const handleLogout = () => {
        logout();
    }

    console.log('MenuBar rendered', { isAuthenticated, user, isLoading });

    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                borderBottom: '1px solid #e2e8f0'
            }}
        >
            {/* Navigation gauche */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button as={Link} to="/" variant="ghost">
                    Home
                </Button>
                <Button 
                    as={Link} 
                    to="/pokedex" 
                    variant="ghost"
                >
                    Pokédex
                </Button>
                <Button variant="ghost">
                    About
                </Button>
            </div>

            {/* Section droite - Authentification */}
            <div>
                {isLoading ? (
                    // Affichage pendant le chargement
                    <Spinner size="sm" />
                ) : isAuthenticated && user ? (
                    // Utilisateur connecté - Menu déroulant
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
                            <HStack spacing={2}>
                                <Avatar size="sm" name={user.username || user.email} />
                                <Text>{user.username || user.email}</Text>
                            </HStack>
                        </MenuButton>
                        <MenuList>
                            <MenuItem as={Link} to="/profile">
                                🔧 Mon profil
                            </MenuItem>
                            <MenuItem as={Link} to="/favorites">
                                ❤️ Mes favoris
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                🚪 Se déconnecter
                            </MenuItem>
                        </MenuList>
                    </Menu>
                ) : (
                    // Utilisateur non connecté - Modal de login
                    <LoginModal 
                    onLogin={handleLogin} 
                    />
                )}
            </div>
        </nav>
    );
};

export default MenuBar;