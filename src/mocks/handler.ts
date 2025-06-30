import { http, HttpResponse } from 'msw'
import getPokemons from './fixtures/getPokemons.json'

export const handlers = [

  // Mock GET /api/pokemons
    http.get('http://localhost:3000/pokemons', () => {
     console.log('Mock : GET /pokemons');
     console.log(getPokemons);
     return HttpResponse.json(getPokemons);
   }),

  // Mock GET /api/pokemons/:id
  http.get('http://localhost:3000/pokemons/:id', (request) => {
    const { id } = request.params;
    console.log(`Mock : GET /pokemons/${id}`);
    const pokemon = getPokemons.pokemons.find(p => p.id === Number(id));
    if (!pokemon) {
      return HttpResponse.json({ error: 'Pokemon not found' }, { status: 404 });
    }
    return HttpResponse.json(pokemon);
  }),

];
