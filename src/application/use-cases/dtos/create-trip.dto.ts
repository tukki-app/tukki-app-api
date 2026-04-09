import { IsUUID, IsString, IsDateString, IsInt, Min, IsEnum } from 'class-validator';

export class CreateTripDto {
  @IsUUID()
  driverId! : string;

  @IsString()
  departureCity!: string;

  @IsString()
  destinationCity!: string;

  @IsDateString()
  departureTime!: string;

  @IsInt()
  @Min(1)
  capacity!: number;

  @IsInt()
  @Min(0)
  price!: number;
}
