import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, And } from 'typeorm';
import { Trip } from '../../domains/trip/entities/trip.entity';
import { SearchTripDto } from './dtos/search-trip.dto';

@Injectable()
export class SearchTripsUseCase {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async execute(dto: SearchTripDto): Promise<{ data: Trip[]; nextCursor?: string }> {
    const { departureCity, destinationCity, departureTime, limit = 10, cursor } = dto;

    const normalizedDeparture = departureCity.trim().toLowerCase();
    const normalizedDestination = destinationCity.trim().toLowerCase();

    const queryBuilder = this.tripRepository.createQueryBuilder('trip')
      .where('trip.departure_city = :departure', { departure: normalizedDeparture })
      .andWhere('trip.destination_city = :destination', { destination: normalizedDestination })
      .andWhere('trip.status = :status', { status: 'ACTIVE' })
      .andWhere('trip.deleted_at IS NULL');

    const startOfDay = new Date(departureTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(departureTime);
    endOfDay.setHours(23, 59, 59, 999);

    queryBuilder.andWhere('trip.departure_time BETWEEN :start AND :end', {
      start: startOfDay,
      end: endOfDay,
    });

    if (cursor) {
      queryBuilder.andWhere('trip.id > :cursor', { cursor });
    }

    queryBuilder
      .orderBy('trip.id', 'ASC')
      .limit(limit + 1);

    const trips = await queryBuilder.getMany();

    let nextCursor: string | undefined;
    if (trips.length > limit) {
      trips.pop();
      nextCursor = trips[trips.length - 1].id;
    }

    return { data: trips, nextCursor };
  }
}
