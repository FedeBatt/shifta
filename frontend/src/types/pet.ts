export const petSpeciesValues = ['DOG', 'CAT', 'BIRD', 'OTHER'] as const;

export type PetSpecies = (typeof petSpeciesValues)[number];

export type PetOwner = {
  id: number;
  firstName: string;
  lastName: string;
};

export type Pet = {
  id: number;
  name: string;
  species: PetSpecies;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: PetOwner;
};

export type CreatePetPayload = {
  name: string;
  species: PetSpecies;
  userId: number;
};

export type UpdatePetPayload = Partial<CreatePetPayload>;
