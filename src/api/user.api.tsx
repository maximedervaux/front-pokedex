import api from './client'; 

export const fetchFavPokemons = async ({ page, limit }: { page: number; limit: number }) => {
  const res = await api.get(`/users/favoris?page=${page}&limit=${limit}`);
  console.log('fetchFavPokemons', res);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
};

export const addFavPokemon = async (pokemonId: number) => {
  const res = await api.post(`/users/favoris/${pokemonId}`);
  console.log('addFavPokemon', res);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors de l\'ajout aux favoris');
  return res.data;
};

export const removeFavPokemon = async (pokemonId: number) => {
  const res = await api.delete(`/users/favoris/${pokemonId}`);
  console.log('removeFavPokemon', res);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors de la suppression des favoris');
  return res.data;
};
