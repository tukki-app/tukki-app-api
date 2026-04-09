import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { TripService } from './services/trip.service';
import { TripController } from './controllers/trip.controller';
import { CreateTripUseCase } from '../../application/use-cases/create-trip.use-case';
import { SearchTripsUseCase } from '../../application/use-cases/search-trips.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
  controllers: [TripController],
  providers: [TripService, CreateTripUseCase, SearchTripsUseCase],
  exports: [TypeOrmModule, TripService, CreateTripUseCase, SearchTripsUseCase],
})
export class TripModule {}
