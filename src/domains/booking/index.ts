import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Trip } from '../trip/entities/trip.entity';
import { BookingService } from './services/booking.service';
import { BookingController } from './controllers/booking.controller';
import { CreateBookingUseCase } from '../../application/use-cases/create-booking.use-case';
import { UpdateBookingStatusUseCase } from '../../application/use-cases/update-booking-status.use-case';
import { GetMyBookingsUseCase } from '../../application/use-cases/get-my-bookings.use-case';
import { GetTripBookingsUseCase } from '../../application/use-cases/get-trip-bookings.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Trip])],
  controllers: [BookingController],
  providers: [
    BookingService,
    CreateBookingUseCase,
    UpdateBookingStatusUseCase,
    GetMyBookingsUseCase,
    GetTripBookingsUseCase,
  ],
  exports: [
    TypeOrmModule,
    BookingService,
    CreateBookingUseCase,
    UpdateBookingStatusUseCase,
    GetMyBookingsUseCase,
    GetTripBookingsUseCase,
  ],
})
export class BookingModule {}
