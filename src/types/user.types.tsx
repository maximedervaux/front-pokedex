export interface LoginCredentials {
  login: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
