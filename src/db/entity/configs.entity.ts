import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('configs')
export class ConfigEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', unique: true, nullable: false })
  name: string;

  @Column({ name: 'value', unique: true, nullable: false })
  value: string;
}
