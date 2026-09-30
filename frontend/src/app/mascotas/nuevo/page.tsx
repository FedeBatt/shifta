'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PetForm } from '@/components/pets/PetForm';
import { Toast } from '@/components/ui/Toast';
import { usePets } from '@/hooks/usePets';
import { useUsers } from '@/hooks/useUsers';

export default function NuevaMascotaPage() {
  const { users, getUsers } = useUsers();
  const { loading, error, setError, createPet, updatePet } = usePets();
  const [success, setSuccess] = useState<string | null>(null);
  const [usersReady, setUsersReady] = useState(false);

  const clearSuccess = useCallback(() => setSuccess(null), []);

  useEffect(() => {
    void getUsers()
      .catch(() => undefined)
      .finally(() => setUsersReady(true));
  }, [getUsers]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-8 md:px-10 md:py-10 dark:bg-black">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col space-y-8">
        <header className="space-y-2">
          <Link
            href="/mascotas"
            className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Volver al listado
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Alta de mascota
          </h1>
        </header>

        {usersReady && users.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Primero tenés que{' '}
            <Link href="/usuarios/nuevo" className="underline">
              crear un usuario
            </Link>{' '}
            para asignarle una mascota.
          </p>
        ) : null}

        <PetForm
          selectedPet={null}
          users={users}
          loading={loading}
          error={error}
          onSuccess={setSuccess}
          onClearMessages={() => {
            setSuccess(null);
            setError(null);
          }}
          createPet={createPet}
          updatePet={updatePet}
        />

        {success ? (
          <Toast message={success} variant="success" onClose={clearSuccess} />
        ) : null}
      </main>
    </div>
  );
}
