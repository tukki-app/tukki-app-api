import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../domains/booking/entities/booking.entity';
import { Trip } from '../../domains/trip/entities/trip.entity';
import { UpdateBookingStatusDto } from './dtos/update-booking-status.dto';

@Injectable()
export class UpdateBookingStatusUseCase {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async execute(bookingId: string, driverId: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['trip'],
    });

    if (!booking) {
      throw new NotFoundException(`Réservation ${bookingId} introuvable.`);
    }

    // Ensure the driver owns the trip associated with this booking
    if (booking.trip.driverId !== driverId) {
      throw new ForbiddenException('Vous ne pouvez gérer que les réservations de vos propres trajets.');
    }

    booking.status = dto.status;
    return await this.bookingRepository.save(booking);
  }
}
