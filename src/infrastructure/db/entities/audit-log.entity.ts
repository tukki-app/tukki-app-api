import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'entity_type' })
  entityType!: string;

  @Column({ name: 'entity_id', type: 'uuid' })
  entityId!: string;

  @Column()
  action!: string;

  @Column({ name: 'performed_by', type: 'uuid', nullable: true })
  performedBy!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
