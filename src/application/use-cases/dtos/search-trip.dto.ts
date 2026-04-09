import { IsString, IsOptional, IsDateString, IsInt, Min } from 'class-validator';

export class SearchTripDto {
  @IsString()
  departureCity!: string;

  @IsString()
  destinationCity!: string;

  @IsDateString()
  departureTime!: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  cursor?: string; // For cursor-based pagination
}
