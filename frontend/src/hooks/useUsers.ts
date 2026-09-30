'use client';

import { useCallback } from 'react';
import http from '@/lib/http';
import { useUsersStore } from '@/stores/usersStore';
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UserOverview,
} from '@/types/user';

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function useUsers() {
  const {
    users,
    selectedUser,
    overview,
    loading,
    error,
    setUsers,
    setSelectedUser,
    setOverview,
    setLoading,
    setError,
    addUser,
    replaceUser,
    removeUser,
  } = useUsersStore();

  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await http.get<User[]>('/users');
      setUsers(data);
      return data;
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los usuarios'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setUsers]);

  const getUser = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await http.get<User>(`/users/${id}`);
        setSelectedUser(data);
        return data;
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo cargar el usuario'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, setSelectedUser],
  );

  const createUser = useCallback(
    async (payload: CreateUserPayload) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await http.post<User>('/users', payload);
        addUser(data);
        return data;
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo crear el usuario'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addUser, setError, setLoading],
  );

  const updateUser = useCallback(
    async (id: number, payload: UpdateUserPayload) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await http.patch<User>(`/users/${id}`, payload);
        replaceUser(data);
        return data;
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo actualizar el usuario'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [replaceUser, setError, setLoading],
  );

  const getOverview = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await http.get<UserOverview>(`/users/${id}/overview`);
        setOverview(data);
        return data;
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo cargar el resumen'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, setOverview],
  );

  const deleteUser = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        await http.delete(`/users/${id}`);
        removeUser(id);
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo eliminar el usuario'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [removeUser, setError, setLoading],
  );

  return {
    users,
    selectedUser,
    overview,
    loading,
    error,
    setSelectedUser,
    setOverview,
    setError,
    getUsers,
    getUser,
    getOverview,
    createUser,
    updateUser,
    deleteUser,
  };
}
