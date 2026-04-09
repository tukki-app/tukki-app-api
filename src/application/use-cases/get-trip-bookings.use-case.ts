import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../domains/booking/entities/booking.entity';
import { Trip } from '../../domains/trip/entities/trip.entity';

@Injectable()
export class GetTripBookingsUseCase {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async execute(tripId: string, driverId: string): Promise<Booking[]> {
    // Verify the trip belongs to the requesting driver
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });

    if (!trip) {
      throw new NotFoundException(`Trajet ${tripId} introuvable.`);
    }

    if (trip.driverId !== driverId) {
      throw new ForbiddenException('Vous ne pouvez consulter que les réservations de vos propres trajets.');
    }

    return await this.bookingRepository.find({
      where: { tripId },
      relations: ['passenger'],
      order: { createdAt: 'ASC' },
    });
  }
}
