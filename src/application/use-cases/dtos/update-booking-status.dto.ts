import { IsEnum } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsEnum(['CONFIRMED', 'REJECTED', 'CANCELLED'])
  status!: 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
}
