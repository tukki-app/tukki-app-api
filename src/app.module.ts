import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityModule } from './domains/identity';
import { TripModule } from './domains/trip';
import { BookingModule } from './domains/booking';
import { AuthModule } from './domains/auth';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, 
      logging: process.env.NODE_ENV === 'development',
    }),
    IdentityModule,
    TripModule,
    BookingModule,
    AuthModule,
  ],
})
export class AppModule {}