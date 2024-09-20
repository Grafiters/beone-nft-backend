import { ProfileEntities } from '@db/entity/profile.entity';
import { CollectionEntities } from '@db/entity/collection.entity';
import { NftTokenEntities } from '@db/entity/nft_token.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class UserEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  provider: string;

  @Column({ name: 'chain_id', type: 'int', default: 0 })
  chainId: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToOne(() => ProfileEntities, (profiles) => profiles.users)
  profiles: Promise<ProfileEntities>;

  @OneToMany(() => CollectionEntities, (collections) => collections.users)
  collections: Promise<CollectionEntities[]>;

  @OneToMany(() => NftTokenEntities, (nft) => nft.users)
  nft_tokens: Promise<NftTokenEntities[]>;
}
