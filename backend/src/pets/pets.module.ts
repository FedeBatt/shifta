import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PetsController } from './pets.controller';
import { PetsRepository } from './pets.repository';
import { PetsService } from './pets.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [PetsController],
  providers: [PetsService, PetsRepository],
  exports: [PetsRepository],
})
export class PetsModule {}
