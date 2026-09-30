'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectInput } from '@/components/ui/SelectInput';
import { TextInput } from '@/components/ui/TextInput';
import { petSpeciesOptions } from '@/lib/petSpecies';
import { petFormDefaults, petSchema, type PetFormValues } from '@/schemas/pet';
import type { CreatePetPayload, Pet } from '@/types/pet';
import type { User } from '@/types/user';

type PetFormProps = {
  selectedPet: Pet | null;
  users: User[];
  loading: boolean;
  error: string | null;
  onSuccess: (message: string) => void;
  onClearMessages: () => void;
  onCancelEdit?: () => void;
  createPet: (payload: CreatePetPayload) => Promise<unknown>;
  updatePet: (id: number, payload: CreatePetPayload) => Promise<unknown>;
};

export function PetForm({
  selectedPet,
  users,
  loading,
  error,
  onSuccess,
  onClearMessages,
  onCancelEdit,
  createPet,
  updatePet,
}: PetFormProps) {
  const isEditing = Boolean(selectedPet);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: selectedPet
      ? {
          name: selectedPet.name,
          species: selectedPet.species,
          userId: String(selectedPet.userId),
        }
      : petFormDefaults,
  });

  const onSubmit = async (values: PetFormValues) => {
    onClearMessages();

    const payload: CreatePetPayload = {
      name: values.name,
      species: values.species,
      userId: Number(values.userId),
    };

    try {
      if (selectedPet) {
        await updatePet(selectedPet.id, payload);
        onSuccess('Mascota actualizada correctamente');
      } else {
        await createPet(payload);
        onSuccess('Mascota creada correctamente');
        reset(petFormDefaults);
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
        {...register('name')}
        error={errors.name?.message}
      />

      <SelectInput
        label="Especie"
        options={petSpeciesOptions}
        {...register('species')}
        error={errors.species?.message}
      />

      <SelectInput
        label="Dueño"
        placeholder="Elegí un dueño"
        options={users.map((user) => ({
          value: String(user.id),
          label: `${user.firstName} ${user.lastName}`,
        }))}
        {...register('userId')}
        error={errors.userId?.message}
      />

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || users.length === 0}
          className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {loading
            ? 'Guardando...'
            : isEditing
              ? 'Guardar cambios'
              : 'Crear mascota'}
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
