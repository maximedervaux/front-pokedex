import api from './client';

export const fetchPokemons = async ({ page, limit }: { page: number; limit: number }) => {
  const res = await api.get(`/pokemons?page=${page}&limit=${limit}`);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
};

export const fetchPokemonById = async (id: number) => {
  const user = localStorage.getItem('user');
  const res = await api.get(`/pokemons/${id}`, { headers: { user: `${user}` } });
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
};

export const fetchPokemonByName = async (name: string ,page: number ,limit: number) => {
  const res = await api.get(`/pokemons/search?page=${page}&limit=${limit}`, { params: { name } });
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
}

export const fetchPokemonByTypes = async () => {
  const res = await api.get(`/pokemons/types`);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
};
