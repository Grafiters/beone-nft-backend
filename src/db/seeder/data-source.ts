import { DataSource } from 'typeorm';
import { UserEntities } from '../entity/users.entity';
import { ConfigEntities } from '../entity/configs.entity';

export const entities = [UserEntities, ConfigEntities];

console.log(process.env);

export const AppDataSource = new DataSource({
  type: 'postgres', // or your database type
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: entities,
  synchronize: false,
});
