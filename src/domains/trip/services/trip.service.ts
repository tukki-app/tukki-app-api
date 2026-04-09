import { Injectable } from '@nestjs/common';
import { CreateTripUseCase } from '../../../application/use-cases/create-trip.use-case';
import { SearchTripsUseCase } from '../../../application/use-cases/search-trips.use-case';
import { CreateTripDto } from '../../../application/use-cases/dtos/create-trip.dto';
import { SearchTripDto } from '../../../application/use-cases/dtos/search-trip.dto';
import { Trip } from '../entities/trip.entity';

@Injectable()
export class TripService {
  constructor(
    private readonly createTripUseCase: CreateTripUseCase,
    private readonly searchTripsUseCase: SearchTripsUseCase,
  ) {}

  async create(dto: CreateTripDto): Promise<Trip> {
    return await this.createTripUseCase.execute(dto);
  }

  async search(dto: SearchTripDto): Promise<{ data: Trip[]; nextCursor?: string }> {
    return await this.searchTripsUseCase.execute(dto);
  }
}
