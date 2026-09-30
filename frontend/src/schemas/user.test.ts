import { createUserSchema } from './user';

const validInput = {
  firstName: 'Ana',
  lastName: 'Pérez',
  email: 'ana@example.com',
  password: 'secret1',
};

describe('createUserSchema', () => {
  it('acepta un usuario válido', () => {
    // Arrange
    const input = { ...validInput };

    // Act
    const result = createUserSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(true);
  });

  it('rechaza un mail inválido', () => {
    // Arrange
    const input = { ...validInput, email: 'no-es-un-mail' };

    // Act
    const result = createUserSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        'Ingresá un mail válido',
      );
    }
  });

  it('rechaza una contraseña de menos de 6 caracteres', () => {
    // Arrange
    const input = { ...validInput, password: '12345' };

    // Act
    const result = createUserSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        'La contraseña debe tener al menos 6 caracteres',
      );
    }
  });
});
