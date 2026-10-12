import { Injectable } from '@nestjs/common';
import { PetSpecies } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const ownerSelect = {
  id: true,
  firstName: true,
  lastName: true,
} as const;

const petWithOwnerSelect = {
  id: true,
  name: true,
  species: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  user: { select: ownerSelect },
} as const;

type PetWriteData = {
  name: string;
  species: PetSpecies;
  userId: number;
};

type PetUpdateData = {
  name?: string;
  species?: PetSpecies;
  userId?: number;
};

@Injectable()
export class PetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany() {
    return this.prisma.pet.findMany({
      select: petWithOwnerSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.pet.findUnique({
      where: { id },
      select: petWithOwnerSelect,
    });
  }

  findByUserId(userId: number) {
    return this.prisma.pet.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        species: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  countByUserId(userId: number) {
    return this.prisma.pet.count({
      where: { userId },
    });
  }

  groupBySpecies(userId: number) {
    return this.prisma.pet.groupBy({
      by: ['species'],
      where: { userId },
      _count: { _all: true },
    });
  }

  create(data: PetWriteData) {
    return this.prisma.pet.create({
      data,
      select: petWithOwnerSelect,
    });
  }

  update(id: number, data: PetUpdateData) {
    return this.prisma.pet.update({
      where: { id },
      data,
      select: petWithOwnerSelect,
    });
  }

  delete(id: number) {
    return this.prisma.pet.delete({
      where: { id },
    });
  }
}
