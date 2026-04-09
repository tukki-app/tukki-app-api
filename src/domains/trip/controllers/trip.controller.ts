import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { TripService } from '../services/trip.service';
import { CreateTripDto } from '../../../application/use-cases/dtos/create-trip.dto';
import { SearchTripDto } from '../../../application/use-cases/dtos/search-trip.dto';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DRIVER')
  @Post()
  async create(@Body() dto: CreateTripDto) {
    return await this.tripService.create(dto);
  }

  @Get('search')
  async search(@Query() dto: SearchTripDto) {
    return await this.tripService.search(dto);
  }
}
