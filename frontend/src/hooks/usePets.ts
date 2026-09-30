'use client';

import { useCallback } from 'react';
import http from '@/lib/http';
import { usePetsStore } from '@/stores/petsStore';
import type { CreatePetPayload, Pet, UpdatePetPayload } from '@/types/pet';

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function usePets() {
  const {
    pets,
    selectedPet,
    loading,
    error,
    setPets,
    setSelectedPet,
    setLoading,
    setError,
    addPet,
    replacePet,
    removePet,
  } = usePetsStore();

  const getPets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await http.get<Pet[]>('/pets');
      setPets(data);
      return data;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las mascotas'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setPets]);

  const getPet = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await http.get<Pet>(`/pets/${id}`);
        setSelectedPet(data);
        return data;
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo cargar la mascota'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, setSelectedPet],
  );

  const createPet = useCallback(
    async (payload: CreatePetPayload) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await http.post<Pet>('/pets', payload);
        addPet(data);
        return data;
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo crear la mascota'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addPet, setError, setLoading],
  );

  const updatePet = useCallback(
    async (id: number, payload: UpdatePetPayload) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await http.patch<Pet>(`/pets/${id}`, payload);
        replacePet(data);
        return data;
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo actualizar la mascota'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [replacePet, setError, setLoading],
  );

  const deletePet = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        await http.delete(`/pets/${id}`);
        removePet(id);
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo eliminar la mascota'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [removePet, setError, setLoading],
  );

  return {
    pets,
    selectedPet,
    loading,
    error,
    setSelectedPet,
    setError,
    getPets,
    getPet,
    createPet,
    updatePet,
    deletePet,
  };
}
