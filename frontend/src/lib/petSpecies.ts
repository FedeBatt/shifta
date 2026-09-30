import type { PetSpecies } from '@/types/pet';

export const petSpeciesLabels: Record<PetSpecies, string> = {
  DOG: 'Perro',
  CAT: 'Gato',
  BIRD: 'Ave',
  OTHER: 'Otro',
};

export const petSpeciesOptions = (
  Object.entries(petSpeciesLabels) as [PetSpecies, string][]
).map(([value, label]) => ({ value, label }));

export function petSpeciesLabel(species: PetSpecies) {
  return petSpeciesLabels[species];
}
