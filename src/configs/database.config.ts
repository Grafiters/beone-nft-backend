/* eslint-disable @typescript-eslint/no-var-requires */
import { registerAs } from '@nestjs/config';
import { env } from 'node:process';
import * as glob from 'glob';

const entities = glob
  .sync(__dirname + '../db/entity/*.entity.ts')
  .map((file) => require(file).default);

export default registerAs('database', () => ({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  entities: entities,
  synchronize: true,
}));
