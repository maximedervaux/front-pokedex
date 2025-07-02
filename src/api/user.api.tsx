import api from './client'; 

export const fetchFavPokemons = async ({ page, limit }: { page: number; limit: number }) => {

  const res = await api.get(`/users/favoris?page=${page}&limit=${limit}`);
  console.log('fetchFavPokemons', res);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
};


