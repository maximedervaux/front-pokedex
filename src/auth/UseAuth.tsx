import { useAuthContext } from './AuthContext';

export const useAuth = () => {
  const { user, isLoading, isAuthenticated, login, logout } = useAuthContext();
  
  return { 
    user, 
    isLoading, 
    isAuthenticated, 
    login, 
    logout 
  };
};