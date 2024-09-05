import * as yaml from 'js-yaml';
import fs from 'fs';

import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pkg;

const filePath = './configs.yml';

const seedConfig = async () => {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  await client.connect();

  try {
    for (const config of data.configs) {
      const { name, value } = config;
      const query =
        'INSERT INTO configs (name, value) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING';
      const values = [name, value];

      await client.query(query, values);
      console.log(`configs ${name} with value ${value} has been seeded`);
    }
    console.log('Configs seeded successfully!');
  } catch (error) {
    console.error('Error seeding configs:', error);
  }
};

seedConfig();
