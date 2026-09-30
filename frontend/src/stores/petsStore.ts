import { create } from 'zustand';
import type { Pet } from '@/types/pet';

type PetsState = {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;
  setPets: (pets: Pet[]) => void;
  setSelectedPet: (pet: Pet | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addPet: (pet: Pet) => void;
  replacePet: (pet: Pet) => void;
  removePet: (id: number) => void;
};

export const usePetsStore = create<PetsState>((set) => ({
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,
  setPets: (pets) => set({ pets }),
  setSelectedPet: (selectedPet) => set({ selectedPet }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addPet: (pet) =>
    set((state) => ({
      pets: [pet, ...state.pets],
    })),
  replacePet: (pet) =>
    set((state) => ({
      pets: state.pets.map((item) => (item.id === pet.id ? pet : item)),
      selectedPet: state.selectedPet?.id === pet.id ? pet : state.selectedPet,
    })),
  removePet: (id) =>
    set((state) => ({
      pets: state.pets.filter((pet) => pet.id !== id),
      selectedPet: state.selectedPet?.id === id ? null : state.selectedPet,
    })),
}));
