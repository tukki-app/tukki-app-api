import { IsUUID, IsInt, Min, IsString, IsOptional } from 'class-validator';


export class CreateBookingDto {
  @IsUUID()
  tripId!: string;

  @IsUUID()
  passengerId!: string;

  @IsInt()
  @Min(1)
  seats!: number;

  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}
