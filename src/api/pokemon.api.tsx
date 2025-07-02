import api from './client';

export const fetchPokemons = async ({ page, limit }: { page: number; limit: number }) => {
  const res = await api.get(`/pokemons?page=${page}&limit=${limit}`);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
};

export const fetchPokemonById = async (id: number) => {
  const res = await api.get(`/pokemons/${id}`);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
};

export const fetchPokemonByName = async (name: string) => {
  const res = await api.get(`/pokemons/name/${name}`);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
}

export const fetchPokemonByTypes = async () => {
  const res = await api.get(`/pokemons/types`);
  if (res.status < 200 || res.status >= 300) throw new Error('Erreur lors du fetch');
  return res.data;
};
