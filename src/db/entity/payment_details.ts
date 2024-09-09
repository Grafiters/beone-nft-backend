import Decimal from 'decimal.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_details')
export class PaymentDetailsEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false, unique: true })
  hash: string;

  @Column({ nullable: false })
  contract_address: string;

  @Column({ nullable: false })
  from: string;

  @Column({ nullable: false })
  to: string;

  @Column({ type: 'decimal', precision: 32, scale: 18 })
  amount: Decimal;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_pending_at: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  payment_success_at: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
