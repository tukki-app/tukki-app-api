import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../../domains/trip/entities/trip.entity';
import { CreateTripDto } from './dtos/create-trip.dto';

@Injectable()
export class CreateTripUseCase {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async execute(dto: CreateTripDto): Promise<Trip> {
    const {
      driverId,
      departureCity,
      destinationCity,
      departureTime,
      capacity,
      price,
    } = dto;

    const normalizedDeparture = departureCity.trim().toLowerCase();
    const normalizedDestination = destinationCity.trim().toLowerCase();

    const trip = this.tripRepository.create({
      driverId,
      departureCity: normalizedDeparture,
      destinationCity: normalizedDestination,
      departureTime: new Date(departureTime),
      capacity,
      availableSeats: capacity,
      price,
      status: 'ACTIVE',
    });

    return await this.tripRepository.save(trip);
  }
}
