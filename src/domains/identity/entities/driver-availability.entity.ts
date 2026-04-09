import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('driver_availability')
export class DriverAvailability {
  @PrimaryColumn('uuid', { name: 'driver_id' })
  driverId!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver!: User;

  @Column({ default: false, name: 'is_online' })
  isOnline!: boolean;

  @UpdateDateColumn({ name: 'last_seen' })
  lastSeen!: Date;
}
