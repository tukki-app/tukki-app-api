import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DriverAvailability } from './entities/driver-availability.entity';
import { IdentityService } from './services/identity.service';
import { IdentityController } from './controllers/identity.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { UpdateDriverAvailabilityUseCase } from '../../application/use-cases/update-driver-availability.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User, DriverAvailability])],
  controllers: [IdentityController],
  providers: [
    IdentityService,
    RegisterUserUseCase,
    UpdateDriverAvailabilityUseCase,
  ],
  exports: [
    TypeOrmModule,
    IdentityService,
    RegisterUserUseCase,
    UpdateDriverAvailabilityUseCase,
  ],
})
export class IdentityModule {}
