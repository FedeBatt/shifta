import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import http from '@/lib/http';
import { useUsersStore } from '@/stores/usersStore';
import type { User } from '@/types/user';
import NuevoUsuarioPage from './page';

jest.mock('@/lib/http', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const httpMock = http as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

function resetStore() {
  useUsersStore.setState({
    users: [],
    selectedUser: null,
    overview: null,
    loading: false,
    error: null,
  });
}

describe('NuevoUsuarioPage', () => {
  beforeEach(() => {
    resetStore();
    httpMock.post.mockReset();
  });

  it('muestra los mensajes de validación si el formulario está vacío', async () => {
    const user = userEvent.setup();

    render(<NuevoUsuarioPage />);

    await user.click(screen.getByRole('button', { name: 'Crear usuario' }));

    expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('El apellido es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('Ingresá un mail válido')).toBeInTheDocument();
  });

  it('crea un usuario y muestra el aviso de éxito', async () => {
    const user = userEvent.setup();
    const created: User = {
      id: 2,
      firstName: 'Luis',
      lastName: 'Gómez',
      email: 'luis@example.com',
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    };

    httpMock.post.mockResolvedValue({ data: created });

    render(<NuevoUsuarioPage />);

    await user.type(screen.getByLabelText('Nombre'), 'Luis');
    await user.type(screen.getByLabelText('Apellido'), 'Gómez');
    await user.type(screen.getByLabelText('Mail'), 'luis@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Usuario creado correctamente',
    );
    expect(httpMock.post).toHaveBeenCalledWith('/users', {
      firstName: 'Luis',
      lastName: 'Gómez',
      email: 'luis@example.com',
      password: 'secret1',
    });
  });
});
