import { z } from 'zod';

const baseUserFields = {
  firstName: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio'),
  lastName: z
    .string()
    .trim()
    .min(1, 'El apellido es obligatorio'),
  email: z
    .email('Ingresá un mail válido')
    .trim()
    .min(1, 'El mail es obligatorio'),
};

export const createUserSchema = z.object({
  ...baseUserFields,
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const updateUserSchema = z.object({
  ...baseUserFields,
  password: z
    .string()
    .refine(
      (value) => value === '' || value.length >= 6,
      'La contraseña debe tener al menos 6 caracteres',
    ),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
export type UserFormValues = CreateUserFormValues | UpdateUserFormValues;

export const userFormDefaults: CreateUserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};
