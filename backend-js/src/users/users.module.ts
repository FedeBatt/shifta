import { Module, forwardRef } from '@nestjs/common';
import { PetsModule } from '../pets/pets.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => PetsModule)],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
