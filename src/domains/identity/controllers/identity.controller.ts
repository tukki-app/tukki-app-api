import { Controller, Post, Body, Patch, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { IdentityService } from '../services/identity.service';
import { RegisterUserDto } from '../../../application/use-cases/dtos/register-user.dto';
import { UpdateAvailabilityDto } from '../../../application/use-cases/dtos/update-availability.dto';

@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return await this.identityService.register(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DRIVER')
  @Patch('availability/:driverId')
  async updateAvailability(
    @Param('driverId', new ParseUUIDPipe()) driverId: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return await this.identityService.updateAvailability(driverId, dto);
  }
}
