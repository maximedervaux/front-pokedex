import React from 'react';
import { Button } from '@chakra-ui/react';
import { TbPokeball } from 'react-icons/tb';
import { Link } from 'react-router-dom';


const MenuBar: React.FC = () => {
    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 1rem',
            }}
        >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button as={Link} to="/">Home</Button>
                <Button as={Link} to="/pokedex">Pokédex</Button>
                <Button>About</Button>
            </div>
            <Button
                colorScheme="red"
                leftIcon={<TbPokeball />}
            >
                Connexion
            </Button>
        </nav>
    );
};

export default MenuBar;
