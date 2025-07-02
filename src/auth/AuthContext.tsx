import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loginUser, fetchMe } from '../api/auth';
import type { AuthContextType, LoginCredentials, User } from '../types/user.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      console.log('=== INITIALISATION AUTH ===');
      console.log('localStorage disponible:', typeof Storage !== 'undefined');
      console.log('Toutes les clés localStorage:', Object.keys(localStorage));
      
      try {
        const savedToken = localStorage.getItem('access_token');
        console.log('Token récupéré:', savedToken ? savedToken.substring(0, 20) + '...' : 'null');
        
        if (savedToken) {
          console.log('Token trouvé, vérification avec l\'API...');
          
          try {
            const userData = await fetchMe(savedToken);
            console.log('Données utilisateur récupérées:', userData);
            
            setToken(savedToken);
            setUser(userData);
            console.log('Auth initialisée avec succès');
          } catch (error) {
            console.error('Erreur lors de la vérification du token:', error);
            
            // Vérifier si c'est une erreur 401 (token invalide)
            if (
              typeof error === 'object' &&
              error !== null &&
              'response' in error &&
              typeof (error as any).response === 'object' &&
              (error as any).response !== null &&
              'status' in (error as any).response &&
              (error as any).response.status === 401
            ) {
              console.log('Token invalide, suppression...');
              localStorage.removeItem('access_token');
            }
            
            setToken(null);
            setUser(null);
            console.log('Token invalide supprimé');
          }
        } else {
          console.log('Aucun token trouvé dans localStorage');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log('=== FIN INITIALISATION AUTH ===');
      }
    };

    // Écouter les événements de déconnexion depuis l'intercepteur
    const handleAuthLogout = () => {
      console.log('Événement auth:logout reçu');
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    initAuth();

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('=== TENTATIVE DE CONNEXION ===');
      const response = await loginUser(credentials.login, credentials.password);
      const { access_token: newToken, user: userData } = response;
      
      console.log('Connexion réussie');
      console.log('Nouveau token reçu:', newToken.substring(0, 20) + '...');
      console.log('Données utilisateur:', userData);
      
      // Sauvegarder le token
      console.log('Sauvegarde du token dans localStorage...');
      localStorage.setItem('access_token', newToken);
      
      // Vérifier que le token a bien été sauvegardé
      const savedToken = localStorage.getItem('access_token');
      console.log('Token sauvegardé vérifié:', savedToken ? savedToken.substring(0, 20) + '...' : 'ERREUR - pas sauvegardé');
      
      setToken(newToken);
      setUser(userData);
      console.log('=== CONNEXION TERMINÉE ===');
      
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('=== DÉCONNEXION ===');
    console.log('Token avant suppression:', localStorage.getItem('access_token') ? 'présent' : 'absent');
    localStorage.removeItem('access_token');
    console.log('Token après suppression:', localStorage.getItem('access_token') ? 'ERREUR - encore présent' : 'supprimé');
    setToken(null);
    setUser(null);
    console.log('=== DÉCONNEXION TERMINÉE ===');
  };

  const isAuthenticated = !!user && !!token;

  // Afficher un loader pendant l'initialisation
  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Chargement...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isLoading, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};