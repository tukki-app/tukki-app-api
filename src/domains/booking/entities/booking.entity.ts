import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Trip } from '../../trip/entities/trip.entity';
import { User } from '../../identity/entities/user.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'trip_id' })
  tripId!: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @Column({ name: 'passenger_id' })
  passengerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'passenger_id' })
  passenger!: User;

  @Column()
  seats!: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  status!: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';

  @Column({ name: 'idempotency_key', nullable: true })
  idempotencyKey!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date;
}
