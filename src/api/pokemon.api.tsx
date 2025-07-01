

export const fetchPokemons = async ({ page, limit }: { page: number; limit: number }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}pokemons?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Erreur lors du fetch');
  return res.json();
};


