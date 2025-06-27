import React from 'react';
import { Button } from '@chakra-ui/react';
import { TbPokeball } from 'react-icons/tb';


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
                <Button>Home</Button>
                <Button>Pokédex</Button>
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
