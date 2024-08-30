import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pkg;

async function createDatabaseIfNotExists() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  await client.connect();

  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname='${process.env.DB_NAME}'`,
  );

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log('Database created');
  } else {
    console.log('Database already exists');
  }

  await client.end();
}

createDatabaseIfNotExists().catch((err) => console.error(err));
