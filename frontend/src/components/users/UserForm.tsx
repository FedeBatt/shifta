'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { TextInput } from '@/components/ui/TextInput';
import {
  createUserSchema,
  updateUserSchema,
  userFormDefaults,
  type UserFormValues,
} from '@/schemas/user';
import type { User } from '@/types/user';

type UserFormProps = {
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  onSuccess: (message: string) => void;
  onClearMessages: () => void;
  onCancelEdit?: () => void;
  createUser: (payload: UserFormValues) => Promise<unknown>;
  updateUser: (
    id: number,
    payload: Partial<UserFormValues>,
  ) => Promise<unknown>;
  setSelectedUser: (user: User | null) => void;
};

export function UserForm({
  selectedUser,
  loading,
  error,
  onSuccess,
  onClearMessages,
  onCancelEdit,
  createUser,
  updateUser,
  setSelectedUser,
}: UserFormProps) {
  const isEditing = Boolean(selectedUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: selectedUser
      ? {
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
          password: '',
        }
      : userFormDefaults,
  });

  const onSubmit = async (values: UserFormValues) => {
    onClearMessages();

    try {
      if (selectedUser) {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          ...(values.password ? { password: values.password } : {}),
        };
        await updateUser(selectedUser.id, payload);
        onSuccess('Usuario actualizado correctamente');
        setSelectedUser({
          ...selectedUser,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        });
      } else {
        await createUser(values);
        onSuccess('Usuario creado correctamente');
        reset(userFormDefaults);
      }
    } catch {
      // el error queda en el store
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      noValidate
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <TextInput
        label="Nombre"
        {...register('firstName')}
        error={errors.firstName?.message}
      />

      <TextInput
        label="Apellido"
        {...register('lastName')}
        error={errors.lastName?.message}
      />

      <TextInput
        label="Mail"
        type="email"
        autoComplete="off"
        {...register('email')}
        error={errors.email?.message}
      />

      <PasswordInput
        label="Contraseña"
        hint={isEditing ? '(dejar vacío para no cambiar)' : undefined}
        {...register('password')}
        error={errors.password?.message}
      />

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {loading
            ? 'Guardando...'
            : isEditing
              ? 'Guardar cambios'
              : 'Crear usuario'}
        </button>

        {isEditing && onCancelEdit ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
