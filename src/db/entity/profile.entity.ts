import { UserEntities } from '@db/entity/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('profiles')
export class ProfileEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @OneToOne(() => UserEntities, (user) => user.profiles)
  @JoinColumn({ name: 'user_id' })
  users: UserEntities;

  @Column()
  username: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'text', nullable: true })
  banner: string;

  @Column({ type: 'longtext', nullable: true })
  bio: string;

  @Column({ type: 'varchar', nullable: true })
  discord: string;

  @Column({ type: 'varchar', nullable: true })
  sosmed_x: string;

  @Column({ type: 'varchar', nullable: true })
  instagram: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
