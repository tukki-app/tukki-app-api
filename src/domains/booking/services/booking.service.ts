import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateBookingUseCase } from '../../../application/use-cases/create-booking.use-case';
import { UpdateBookingStatusUseCase } from '../../../application/use-cases/update-booking-status.use-case';
import { GetMyBookingsUseCase } from '../../../application/use-cases/get-my-bookings.use-case';
import { GetTripBookingsUseCase } from '../../../application/use-cases/get-trip-bookings.use-case';
import { CreateBookingDto } from '../../../application/use-cases/dtos/create-booking.dto';
import { UpdateBookingStatusDto } from '../../../application/use-cases/dtos/update-booking-status.dto';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly updateBookingStatusUseCase: UpdateBookingStatusUseCase,
    private readonly getMyBookingsUseCase: GetMyBookingsUseCase,
    private readonly getTripBookingsUseCase: GetTripBookingsUseCase,
  ) {}

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        return await this.createBookingUseCase.execute(dto);
      } catch (error: any) {
        lastError = error;
        const isConcurrencyError = error.code === '40P01' || error.code === '40001' || error.status === 409;
        if (isConcurrencyError && attempt < this.MAX_RETRIES) {
          this.logger.warn(`Concurrency conflict on attempt ${attempt}. Retrying...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 50));
          continue;
        }
        throw error;
      }
    }

    throw lastError || new InternalServerErrorException('Failed to create booking after retries');
  }

  async updateStatus(bookingId: string, driverId: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    return await this.updateBookingStatusUseCase.execute(bookingId, driverId, dto);
  }

  async getMyBookings(passengerId: string): Promise<Booking[]> {
    return await this.getMyBookingsUseCase.execute(passengerId);
  }

  async getTripBookings(tripId: string, driverId: string): Promise<Booking[]> {
    return await this.getTripBookingsUseCase.execute(tripId, driverId);
  }
}
