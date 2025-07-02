// api/auth.ts
import api from './client'; 
import type { User } from '../types/user.types';

export const loginUser = async (login: string, password: string) => {
  console.log('loginUser appelé pour:', login);
  
  try {
    const response = await api.post('/auth/login', { 
      username : login, 
      password 
    });
    
    console.log('Réponse login:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur login:', error);
    throw error;
  }
};

export const fetchMe = async (token: string): Promise<User> => {
  console.log('fetchMe appelé avec token:', token.substring(0, 20) + '...');
  
  try {
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Réponse fetchMe:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur fetchMe:', error);
    throw error;
  }
};