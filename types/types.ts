export interface Realmon {
    id: number | null;
    speciesId: string;
    latitude: number;
    longitude: number;
    observedAt: string;
    imageUrl: string;
    source: string;
    speciesName: string;
    scientificName: string;
    speciesIcon: string;
    category: string;
    username: string;
    wikiUrl: string;
  }
  
  export interface SpeciesDetails {
    id: string;
    name: string;
    scientificName: string;
    wikiUrl: string;
    icon: string | null;
    category: string;
  
    funFact: string;
    symbolism: string;
    texture: string;
    lifeCycle: string;
    protectionLevel: string;
  }
  