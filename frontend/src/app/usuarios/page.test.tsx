import { render, screen, waitFor } from '@testing-library/react';
import http from '@/lib/http';
import { useUsersStore } from '@/stores/usersStore';
import type { User } from '@/types/user';
import UsuariosPage from './page';

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

const ana: User = {
  id: 1,
  firstName: 'Ana',
  lastName: 'Pérez',
  email: 'ana@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
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

describe('UsuariosPage', () => {
  beforeEach(() => {
    resetStore();
    httpMock.get.mockReset();
    httpMock.get.mockResolvedValue({ data: [] });
  });

  it('lista los usuarios que devuelve el alta', async () => {
    httpMock.get.mockResolvedValue({ data: [ana] });

    render(<UsuariosPage />);

    expect(await screen.findByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Pérez')).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver' })).toHaveAttribute(
      'href',
      '/usuarios/1',
    );
  });

  it('muestra el estado vacío', async () => {
    render(<UsuariosPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Todavía no hay usuarios registrados'),
      ).toBeInTheDocument();
    });
  });
});
