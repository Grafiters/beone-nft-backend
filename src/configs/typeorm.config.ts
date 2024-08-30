import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'database',
  entities: [join(__dirname, '..', 'db/entity', '*.entity.{js,ts}')],
  synchronize: true,
  migrations: [join(__dirname, '..', 'db/migrations', '*.{js,ts}')],
};

export const dataSource = new DataSource(typeOrmConfig);
