import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

type UserWriteData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type UserUpdateData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany() {
    return this.prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
  }

  create(data: UserWriteData) {
    return this.prisma.user.create({
      data,
      select: userSelect,
    });
  }

  update(id: number, data: UserUpdateData) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  }

  delete(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
