import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CollectionEntities } from './collection.entity';
import { UserEntities } from './users.entity';

@Entity('nft_tokens')
export class NftTokenEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntities, (user) => user.collections)
  @JoinColumn({ name: 'user_id' })
  users: Promise<UserEntities>;

  @ManyToOne(() => CollectionEntities, (collection) => collection.nft_tokens)
  @JoinColumn({ name: 'collection_id' })
  collections: Promise<CollectionEntities>;

  @Column({ type: 'varchar', nullable: false, unique: true })
  uid: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  hash: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  logo_url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  properties: string;

  @Column({ type: 'jsonb', nullable: true })
  statistic: string;

  @Column({ type: 'jsonb', nullable: true })
  tag: string;

  @Column({ type: 'int', nullable: true })
  supply: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
