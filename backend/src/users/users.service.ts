import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PetsRepository } from '../pets/pets.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => PetsRepository))
    private readonly petsRepository: PetsRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: hashedPassword,
    });
  }

  findAll() {
    return this.usersRepository.findMany();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.email) {
      const existing = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (existing && existing.id !== id) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    const data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    } = {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email: updateUserDto.email,
    };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.usersRepository.update(id, data);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.usersRepository.delete(id);

    return { id };
  }

  async getOverview(id: number) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const [pets, totalPets, grouped] = await Promise.all([
      this.petsRepository.findByUserId(id),
      this.petsRepository.countByUserId(id),
      this.petsRepository.groupBySpecies(id),
    ]);

    return {
      user: {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        memberSince: user.createdAt,
      },
      stats: {
        totalPets,
        bySpecies: grouped.map((row) => ({
          species: row.species,
          count: row._count._all,
        })),
      },
      pets,
    };
  }
}
