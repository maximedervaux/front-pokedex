import api from './client';

export const fetchPokemons = async ({ page, limit }: { page: number; limit: number }) => {
  const res = await api.get(`/pokemons?page=${page}&limit=${limit}`);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
};


