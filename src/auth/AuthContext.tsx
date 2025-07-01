import { createContext, useContext, useState, useEffect, type ReactNode} from 'react';
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

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('authToken');
      if (savedToken) {
        try {
          const userData = await fetchMe();
          setToken(savedToken);
          setUser(userData);
        } catch (error) {
          console.error('Token invalide:', error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await loginUser(credentials.login, credentials.password);
      const { token: newToken, user: userData } = response;
      
      // Sauvegarder le token
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      
    } catch (error) {
      // TODO Gérer les erreurs de l'API
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user && !!token;

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