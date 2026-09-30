'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { UserForm } from '@/components/users/UserForm';
import { Toast } from '@/components/ui/Toast';
import { useUsers } from '@/hooks/useUsers';

export default function NuevoUsuarioPage() {
  const { loading, error, setError, setSelectedUser, createUser, updateUser } =
    useUsers();
  const [success, setSuccess] = useState<string | null>(null);

  const clearSuccess = useCallback(() => setSuccess(null), []);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-8 md:px-10 md:py-10 dark:bg-black">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col space-y-8">
        <header className="space-y-2">
          <Link
            href="/usuarios"
            className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Volver al listado
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Alta de usuario
          </h1>
        </header>

        <UserForm
          selectedUser={null}
          loading={loading}
          error={error}
          onSuccess={setSuccess}
          onClearMessages={() => {
            setSuccess(null);
            setError(null);
          }}
          createUser={createUser}
          updateUser={updateUser}
          setSelectedUser={setSelectedUser}
        />

        {success ? (
          <Toast message={success} variant="success" onClose={clearSuccess} />
        ) : null}
      </main>
    </div>
  );
}
