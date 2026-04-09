import { Injectable } from '@nestjs/common';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { UpdateDriverAvailabilityUseCase } from '../../../application/use-cases/update-driver-availability.use-case';
import { RegisterUserDto } from '../../../application/use-cases/dtos/register-user.dto';
import { UpdateAvailabilityDto } from '../../../application/use-cases/dtos/update-availability.dto';
import { User } from '../entities/user.entity';
import { DriverAvailability } from '../entities/driver-availability.entity';

@Injectable()
export class IdentityService {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly updateDriverAvailabilityUseCase: UpdateDriverAvailabilityUseCase,
  ) {}

  async register(dto: RegisterUserDto): Promise<User> {
    return await this.registerUserUseCase.execute(dto);
  }

  async updateAvailability(driverId: string, dto: UpdateAvailabilityDto): Promise<DriverAvailability> {
    return await this.updateDriverAvailabilityUseCase.execute(driverId, dto);
  }
}
