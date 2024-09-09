import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('staked_contracts')
export class StakedContractEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: 'int', nullable: false })
  payment_detail_id: number;

  @Column({ type: 'varchar', nullable: true })
  hash_initialize: string;

  @Column({ nullable: false, unique: true })
  contract_address: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  symbol: string;

  @Column({ nullable: true })
  staked_token: string;

  @Column({ nullable: true })
  reward_token: string;

  @Column({ nullable: true, default: '0' })
  reward_per_block: string;

  @Column({ nullable: true, default: 0 })
  start_block: number;

  @Column({ nullable: true, default: 0 })
  bonus_end_block: number;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
