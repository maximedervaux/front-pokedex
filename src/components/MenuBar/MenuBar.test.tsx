import { render, screen, fireEvent, waitFor,  } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import MenuBar from './MenuBar'; 
import * as AuthContextModule from '../../auth/AuthContext'; 
import type { User } from '../../types/user.types'; 

vi.mock('../../auth/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof AuthContextModule>();
  return {
    ...actual,
    useAuthContext: vi.fn(), 
  };
});

vi.mock('../index', async (importOriginal) => { 
  const actual = await importOriginal<typeof import('../index')>(); 
  return {
    ...actual, 
    LoginModal: vi.fn(({ onLogin }) => ( 
      <button data-testid="login-modal-button" onClick={() => onLogin({ login: 'mock', password: 'mock' })}>
        Se connecter
      </button>
    )),
  };
});
if (typeof HTMLElement !== 'undefined' && !('scrollTo' in HTMLElement.prototype)) {
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  });
}


describe('MenuBar', () => {
  const mockUseAuthContext = AuthContextModule.useAuthContext as unknown as Mock;

  beforeEach(() => {
    mockUseAuthContext.mockClear();
    vi.clearAllMocks(); 
  });

  // Test 1: Displays loading spinner when isLoading is true
  it('should display a spinner when authentication is loading', () => {
    mockUseAuthContext.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <Router>
        <MenuBar />
      </Router>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument(); 
    expect(screen.queryByText('Se connecter')).not.toBeInTheDocument();
  });

  // Test 2: Displays LoginModal button when not authenticated
  it('should display the LoginModal button when not authenticated', () => {
    mockUseAuthContext.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <Router>
        <MenuBar />
      </Router>
    );

    expect(screen.getByTestId('login-modal-button')).toBeInTheDocument();
    expect(screen.queryByText('Mon profil')).not.toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  // Test 3: Displays user menu when authenticated
  it('should display the user menu when authenticated', () => {
    const mockUser: User = { id: '1', username: 'TestUser', email: 'test@example.com' };
    mockUseAuthContext.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: mockUser,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <Router>
        <MenuBar />
      </Router>
    );

    expect(screen.getByText('TestUser')).toBeInTheDocument();
    expect(screen.queryByTestId('login-modal-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  // Test 4: Calls logout when "Se déconnecter" is clicked
  it('should call logout when "Se déconnecter" is clicked', async () => {
    const mockLogout = vi.fn();
    const mockUser: User = { id: '1', username: 'TestUser', email: 'test@example.com' };
    mockUseAuthContext.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: mockUser,
      login: vi.fn(),
      logout: mockLogout,
    });

    render(
      <Router>
        <MenuBar />
      </Router>
    );

    // Open the menu
    fireEvent.click(screen.getByText('TestUser'));


    await waitFor(() => {
        // Wait for the "Se déconnecter" menu item to be in the document
        expect(screen.getByRole('menuitem', { name: /Se déconnecter/i })).toBeInTheDocument();
        });

    // Click the logout item
    fireEvent.click(screen.getByText('🚪 Se déconnecter'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  // Test 5: Navigation links are present
  it('should have Home and Pokédex navigation links', () => {
    mockUseAuthContext.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <Router>
        <MenuBar />
      </Router>
    );

    const homeLink = screen.getByRole('link', { name: /home/i });
    const pokedexLink = screen.getByRole('link', { name: /pokédex/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(pokedexLink).toBeInTheDocument();
    expect(pokedexLink).toHaveAttribute('href', '/pokedex');
  });

  // Test 6: User menu items are present when logged in
  it('should display profile and favorites links in the user menu when logged in', async () => {
    const mockUser: User = { id: '1', username: 'TestUser', email: 'test@example.com' };
    mockUseAuthContext.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: mockUser,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <Router>
        <MenuBar />
      </Router>
    );

    // Open the menu
    fireEvent.click(screen.getByText('TestUser'));

    await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /Mon profil/i })).toBeInTheDocument();
        });
    expect(screen.getByText('🔧 Mon profil')).toBeInTheDocument();
    expect(screen.getByText('❤️ Mes favoris')).toBeInTheDocument();

    const profileLink = screen.getByRole('menuitem', { name: /Mon profil/i });
    const favoritesLink = screen.getByRole('menuitem', { name: /Mes favoris/i });

    expect(profileLink).toHaveAttribute('href', '/profile');
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });
});