import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../identity/entities/user.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'driver_id' })
  driverId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver!: User;

  @Column({ name: 'departure_city' })
  departureCity!: string;

  @Column({ name: 'destination_city' })
  destinationCity!: string;

  @Column({ name: 'departure_time' })
  departureTime!: Date;

  @Column()
  capacity!: number;

  @Column({ name: 'available_seats' })
  availableSeats!: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  status!: 'ACTIVE' | 'FULL' | 'CANCELLED' | 'COMPLETED';

  @Column({ nullable: true })
  price!: number;

  @Column({ name: 'vehicle_images', type: 'text', array: true, default: [] })
  vehicleImages!: string[];

  @VersionColumn()
  version!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date;
}
