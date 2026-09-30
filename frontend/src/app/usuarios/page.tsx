'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useUsers } from '@/hooks/useUsers';

export default function UsuariosPage() {
  const { users, loading, error, getUsers } = useUsers();

  useEffect(() => {
    void getUsers().catch(() => undefined);
  }, [getUsers]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-8 md:px-10 md:py-10 dark:bg-black">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Usuarios
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Listado de personas registradas
            </p>
          </div>
          <Link
            href="/usuarios/nuevo"
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Crear usuario
          </Link>
        </header>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        ) : null}

        {loading && users.length === 0 ? (
          <p className="text-sm text-zinc-400">Cargando...</p>
        ) : null}

        {!loading && users.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Todavía no hay usuarios registrados
          </p>
        ) : null}

        {users.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <table className="w-full border-collapse text-left text-sm [&_td]:px-5 [&_td]:py-4 [&_th]:px-5 [&_th]:py-4">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="font-medium">Nombre</th>
                  <th className="font-medium">Apellido</th>
                  <th className="font-medium">Mail</th>
                  <th className="font-medium">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                  >
                    <td className="font-medium text-zinc-900 dark:text-zinc-50">
                      {user.firstName}
                    </td>
                    <td className="text-zinc-700 dark:text-zinc-300">
                      {user.lastName}
                    </td>
                    <td className="text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/usuarios/${user.id}`}
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
        ) : null}
      </main>
    </div>
  );
}
