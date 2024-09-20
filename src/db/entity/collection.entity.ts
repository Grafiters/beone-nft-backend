import { UserEntities } from '@db/entity/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CollectionType } from './enum/collection';
import { NftTokenEntities } from './nft_token.entity';

@Entity('collections')
export class CollectionEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @ManyToOne(() => UserEntities, (user) => user.collections)
  @JoinColumn({ name: 'user_id' })
  users: Promise<UserEntities>;

  @Column({ type: 'varchar', nullable: false, unique: true })
  uid: string;

  @Column({ type: 'varchar', nullable: true, unique: false })
  hash: string;

  @Column({ type: 'varchar', nullable: false, unique: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: false })
  symbol: string;

  @Column({ type: 'varchar', nullable: false, unique: false })
  logo_url: string;

  @OneToMany(() => NftTokenEntities, (collections) => collections.collections)
  nft_tokens: Promise<NftTokenEntities[]>;

  @Column({
    type: 'enum',
    enum: CollectionType,
    default: CollectionType.SELF,
  })
  mint_type: CollectionType;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
