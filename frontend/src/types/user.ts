import type { PetSpecies } from '@/types/pet';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UserOverview = {
  user: {
    id: number;
    fullName: string;
    email: string;
    memberSince: string;
  };
  stats: {
    totalPets: number;
    bySpecies: { species: PetSpecies; count: number }[];
  };
  pets: {
    id: number;
    name: string;
    species: PetSpecies;
    createdAt: string;
  }[];
};

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;
