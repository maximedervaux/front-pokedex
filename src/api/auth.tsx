import api from './client';

export const fetchMe = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

export const loginUser = async (login: string, password: string) => {
  const { data } = await api.post('/auth/login', { username:login, password });
  return data; 
};