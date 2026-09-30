import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsRepository } from './pets.repository';

@Injectable()
export class PetsService {
  constructor(
    private readonly petsRepository: PetsRepository,
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createPetDto: CreatePetDto) {
    await this.assertOwnerExists(createPetDto.userId);

    return this.petsRepository.create(createPetDto);
  }

  findAll() {
    return this.petsRepository.findMany();
  }

  async findOne(id: number) {
    const pet = await this.petsRepository.findById(id);

    if (!pet) {
      throw new NotFoundException(`Mascota con id ${id} no encontrada`);
    }

    return pet;
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    await this.findOne(id);

    if (updatePetDto.userId !== undefined) {
      await this.assertOwnerExists(updatePetDto.userId);
    }

    return this.petsRepository.update(id, updatePetDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.petsRepository.delete(id);

    return { id };
  }

  private async assertOwnerExists(userId: number) {
    const owner = await this.usersRepository.findById(userId);

    if (!owner) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }
  }
}
