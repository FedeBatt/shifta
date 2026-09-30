import { z } from 'zod';
import { petSpeciesValues } from '@/types/pet';

export const petSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  species: z.enum(petSpeciesValues, { message: 'Elegí una especie' }),
  userId: z.string().min(1, 'Elegí un dueño'),
});

export type PetFormValues = z.infer<typeof petSchema>;

export const petFormDefaults: PetFormValues = {
  name: '',
  species: 'DOG',
  userId: '',
};
