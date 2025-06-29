import { http, HttpResponse } from 'msw'
import getPokemon from './fixtures/getPokemon.json'

export const handlers = [

  // Mock GET /api/pokemons
    http.get('http://localhost:3000/pokemon', () => {
     return HttpResponse.json(getPokemon);
   }),
];
