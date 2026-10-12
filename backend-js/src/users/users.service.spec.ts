jest.mock('../pets/pets.repository', () => ({
  PetsRepository: class PetsRepository {},
}));

jest.mock('./users.repository', () => ({
  UsersRepository: class UsersRepository {},
}));

import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const user = {
    id: 1,
    firstName: 'Ana',
    lastName: 'Pérez',
    email: 'ana@example.com',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const petsRepository = {
    findByUserId: jest.fn(),
    countByUserId: jest.fn(),
    groupBySpecies: jest.fn(),
  };

  const usersRepository = {
    findById: jest.fn(),
  };

  const service = new UsersService(
    usersRepository as never,
    petsRepository as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverview', () => {
    it('arma el overview a partir de las consultas de los repositories', async () => {
      usersRepository.findById.mockResolvedValue(user);
      petsRepository.findByUserId.mockResolvedValue([
        {
          id: 10,
          name: 'Luna',
          species: 'DOG',
          createdAt: new Date('2026-02-01T00:00:00.000Z'),
        },
      ]);
      petsRepository.countByUserId.mockResolvedValue(2);
      petsRepository.groupBySpecies.mockResolvedValue([
        { species: 'DOG', _count: { _all: 1 } },
        { species: 'CAT', _count: { _all: 1 } },
      ]);

      const result = await service.getOverview(1);

      expect(usersRepository.findById).toHaveBeenCalledWith(1);
      expect(petsRepository.findByUserId).toHaveBeenCalledWith(1);
      expect(petsRepository.countByUserId).toHaveBeenCalledWith(1);
      expect(petsRepository.groupBySpecies).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        user: {
          id: 1,
          fullName: 'Ana Pérez',
          email: 'ana@example.com',
          memberSince: user.createdAt,
        },
        stats: {
          totalPets: 2,
          bySpecies: [
            { species: 'DOG', count: 1 },
            { species: 'CAT', count: 1 },
          ],
        },
        pets: [
          {
            id: 10,
            name: 'Luna',
            species: 'DOG',
            createdAt: new Date('2026-02-01T00:00:00.000Z'),
          },
        ],
      });
    });

    it('lanza NotFound si el usuario no existe y no consulta mascotas', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(service.getOverview(99)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(petsRepository.findByUserId).not.toHaveBeenCalled();
      expect(petsRepository.countByUserId).not.toHaveBeenCalled();
      expect(petsRepository.groupBySpecies).not.toHaveBeenCalled();
    });
  });
});
