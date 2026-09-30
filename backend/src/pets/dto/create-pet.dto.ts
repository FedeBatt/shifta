import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { PetSpecies } from '../../../generated/prisma/client';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(PetSpecies)
  species: PetSpecies;

  @Type(() => Number)
  @IsInt()
  userId: number;
}
