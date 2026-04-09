import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../domains/booking/entities/booking.entity';

@Injectable()
export class GetMyBookingsUseCase {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async execute(passengerId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { passengerId },
      relations: ['trip', 'trip.driver'],
      order: { createdAt: 'DESC' },
    });
  }
}
