'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { UserForm } from '@/components/users/UserForm';
import { Toast } from '@/components/ui/Toast';
import { useUsers } from '@/hooks/useUsers';
import { petSpeciesLabel } from '@/lib/petSpecies';

export default function UsuarioDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const {
    selectedUser,
    overview,
    loading,
    error,
    setSelectedUser,
    setError,
    getUser,
    getOverview,
    updateUser,
    deleteUser,
    createUser,
  } = useUsers();

  const [success, setSuccess] = useState<string | null>(null);
  const clearSuccess = useCallback(() => setSuccess(null), []);

  useEffect(() => {
    if (!Number.isInteger(id)) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        await getUser(id);
        if (!cancelled) {
          await getOverview(id);
        }
      } catch {
        // el error queda en el store
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [getOverview, getUser, id]);

  const handleDelete = async () => {
    setSuccess(null);
    setError(null);

    try {
      await deleteUser(id);
      router.push('/usuarios');
    } catch {
      // el error queda en el store
    }
  };

  const memberSince = overview
    ? new Date(overview.user.memberSince).toLocaleDateString('es-AR')
    : null;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-8 md:px-10 md:py-10 dark:bg-black">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-10">
        <header className="space-y-2">
          <Link
            href="/usuarios"
            className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Volver al listado
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {overview?.user.fullName ?? 'Usuario'}
          </h1>
          {overview ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {overview.user.email} · Desde {memberSince}
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

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Mascotas</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              {overview?.stats.totalPets ?? '—'}
            </p>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Por especie
            </p>
            {overview && overview.stats.bySpecies.length > 0 ? (
              <ul className="mt-2 space-y-1 text-sm text-zinc-800 dark:text-zinc-200">
                {overview.stats.bySpecies.map((row) => (
                  <li key={row.species} className="flex justify-between gap-4">
                    <span>{petSpeciesLabel(row.species)}</span>
                    <span className="font-medium">{row.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {overview ? 'Sin mascotas' : 'Cargando...'}
              </p>
            )}
          </article>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Mascotas
          </h2>
          {overview?.pets.length ? (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <table className="w-full border-collapse text-left text-sm [&_td]:px-5 [&_td]:py-4 [&_th]:px-5 [&_th]:py-4">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  <tr>
                    <th className="font-medium">Nombre</th>
                    <th className="font-medium">Especie</th>
                    <th className="font-medium">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {overview.pets.map((pet) => (
                    <tr
                      key={pet.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                    >
                      <td className="font-medium text-zinc-900 dark:text-zinc-50">
                        {pet.name}
                      </td>
                      <td className="text-zinc-500 dark:text-zinc-400">
                        {petSpeciesLabel(pet.species)}
                      </td>
                      <td className="text-right">
                        <Link
                          href={`/mascotas/${pet.id}`}
                          className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              {overview
                ? 'Este usuario no tiene mascotas'
                : 'Cargando mascotas...'}
            </p>
          )}
        </section>

        {selectedUser && selectedUser.id === id ? (
          <section className="mx-auto w-full max-w-xl space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Editar usuario
            </h2>
            <UserForm
              key={selectedUser.updatedAt}
              selectedUser={selectedUser}
              loading={loading}
              error={null}
              onSuccess={(message) => {
                setSuccess(message);
                void getOverview(id).catch(() => undefined);
              }}
              onClearMessages={() => {
                setSuccess(null);
                setError(null);
              }}
              onCancelEdit={() => router.push('/usuarios')}
              createUser={createUser}
              updateUser={updateUser}
              setSelectedUser={setSelectedUser}
            />
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={loading}
              className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              Borrar usuario
            </button>
          </section>
        ) : null}
      </main>
    </div>
  );
}
