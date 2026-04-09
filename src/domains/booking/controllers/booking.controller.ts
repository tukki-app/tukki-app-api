import { Controller, Post, Get, Patch, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto } from '../../../application/use-cases/dtos/create-booking.dto';
import { UpdateBookingStatusDto } from '../../../application/use-cases/dtos/update-booking-status.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // PASSENGER: Create a booking request (starts as PENDING)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PASSENGER')
  @Post()
  async create(@Body() dto: CreateBookingDto) {
    return await this.bookingService.createBooking(dto);
  }

  // PASSENGER: List my bookings with trip + driver info
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PASSENGER')
  @Get('my-bookings')
  async getMyBookings(@Request() req: any) {
    // userId is injected from the JWT payload by JwtStrategy
    return await this.bookingService.getMyBookings(req.user.userId);
  }

  // DRIVER: List all booking requests on one of their trips
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DRIVER')
  @Get('trip/:tripId')
  async getTripBookings(
    @Param('tripId', new ParseUUIDPipe()) tripId: string,
    @Request() req: any,
  ) {
    return await this.bookingService.getTripBookings(tripId, req.user.userId);
  }

  // DRIVER: Accept or reject a booking request
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DRIVER')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBookingStatusDto,
    @Request() req: any,
  ) {
    return await this.bookingService.updateStatus(id, req.user.userId, dto);
  }
}
