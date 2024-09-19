import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ProfileEntities } from './profile.entity';
import { CollectionEntities } from './collection.entity';

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

  @OneToOne(() => ProfileEntities, (profiles) => profiles.users)
  profiles: ProfileEntities;

  @OneToMany(() => CollectionEntities, (collections) => collections.users)
  collections: CollectionEntities[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
