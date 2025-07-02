export interface PokemonCardProps {
  id: number;
  nom: string;
  hires: string;
  type: string[];
}


export interface PokemonDetails extends PokemonCardProps {
      espece: string,
      description: string,
      evolutionNiveau: string,
      taille: string,
      poids: string,
      genre: string,
      talentPrincipal: string,
      talentCache: string,
      sprite: string,
      miniature: string,
      hp: number,
      attaque: number,
      defense: number,
      attaqueSpe: number,
      defenseSpe: number,
      vitesse: number,
      isFavori: boolean;
}
