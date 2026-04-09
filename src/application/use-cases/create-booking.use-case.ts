import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Trip } from '../../domains/trip/entities/trip.entity';
import { Booking } from '../../domains/booking/entities/booking.entity';
import { AuditLog } from '../../infrastructure/db/entities/audit-log.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class CreateBookingUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(dto: CreateBookingDto): Promise<Booking> {
    const { tripId, passengerId, seats, idempotencyKey } = dto;

    return await this.dataSource.transaction(async (manager) => {
      if (idempotencyKey) {
        const existingBooking = await manager.findOne(Booking, {
          where: { idempotencyKey },
        });
        if (existingBooking) {
          return existingBooking; 
        }
      }

      const trip = await manager.findOne(Trip, {
        where: { id: tripId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!trip) {
        throw new NotFoundException(`Trip ${tripId} not found`);
      }

      if (trip.status !== 'ACTIVE') {
        throw new BadRequestException(`Trip is not active (status: ${trip.status})`);
      }

      if (trip.availableSeats < seats) {
        throw new ConflictException(`Not enough seats available (${trip.availableSeats} requested ${seats})`);
      }

      const booking = manager.create(Booking, {
        tripId,
        passengerId,
        seats,
        idempotencyKey,
        status: 'PENDING',
      });

      const savedBooking = await manager.save(booking);

      trip.availableSeats -= seats;
      if (trip.availableSeats === 0) {
        trip.status = 'FULL';
      }
      
      await manager.save(trip);

      const audit = manager.create(AuditLog, {
        entityType: 'BOOKING',
        entityId: savedBooking.id,
        action: 'CREATE_BOOKING',
        performedBy: passengerId,
        metadata: {
          tripId,
          seatsRequested: seats,
          remainingSeats: trip.availableSeats,
        },
      });
      await manager.save(audit);

      return savedBooking;
    });
  }
}
