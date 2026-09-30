'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PetForm } from '@/components/pets/PetForm';
import { Toast } from '@/components/ui/Toast';
import { usePets } from '@/hooks/usePets';
import { useUsers } from '@/hooks/useUsers';
import { petSpeciesLabel } from '@/lib/petSpecies';

export default function MascotaDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const { users, getUsers } = useUsers();
  const {
    selectedPet,
    loading,
    error,
    setError,
    getPet,
    updatePet,
    deletePet,
    createPet,
  } = usePets();

  const [success, setSuccess] = useState<string | null>(null);
  const clearSuccess = useCallback(() => setSuccess(null), []);

  useEffect(() => {
    if (!Number.isInteger(id)) {
      return;
    }

    void getPet(id).catch(() => undefined);
    void getUsers().catch(() => undefined);
  }, [getPet, getUsers, id]);

  const handleDelete = async () => {
    setSuccess(null);
    setError(null);

    try {
      await deletePet(id);
      router.push('/mascotas');
    } catch {
      // el error queda en el store
    }
  };

  const pet = selectedPet?.id === id ? selectedPet : null;

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
            {pet?.name ?? 'Mascota'}
          </h1>
          {pet ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {petSpeciesLabel(pet.species)} · Dueño{' '}
              <Link
                href={`/usuarios/${pet.user.id}`}
                className="underline-offset-4 hover:underline"
              >
                {pet.user.firstName} {pet.user.lastName}
              </Link>
            </p>
          ) : null}
        </header>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        ) : null}

        {success ? (
          <Toast message={success} variant="success" onClose={clearSuccess} />
        ) : null}

        {pet ? (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Editar mascota
            </h2>
            <PetForm
              key={`${pet.id}-${pet.updatedAt}`}
              selectedPet={pet}
              users={users}
              loading={loading}
              error={null}
              onSuccess={setSuccess}
              onClearMessages={() => {
                setSuccess(null);
                setError(null);
              }}
              onCancelEdit={() => router.push('/mascotas')}
              createPet={createPet}
              updatePet={updatePet}
            />
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={loading}
              className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              Borrar mascota
            </button>
          </section>
        ) : loading ? (
          <p className="text-sm text-zinc-400">Cargando...</p>
        ) : null}
      </main>
    </div>
  );
}
