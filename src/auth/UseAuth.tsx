import { useAuthContext } from './AuthContext';

export const useAuth = () => {
  const { user, token, isLoading, isAuthenticated, login, logout } = useAuthContext();
  
  return { 
    user, 
    token,
    isLoading, 
    isAuthenticated, 
    login, 
    logout 
  };
};