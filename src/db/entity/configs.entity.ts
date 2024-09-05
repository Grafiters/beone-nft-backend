import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('configs')
export class ConfigEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'value' })
  value: string;
}
