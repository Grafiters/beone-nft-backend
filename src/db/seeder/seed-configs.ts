import { readFileSync } from 'fs';
import { AppDataSource } from './data-source'; // Adjust path
import { ConfigEntities } from '../entity/configs.entity'; // Adjust path
import * as yaml from 'js-yaml';

const seedConfigs = async () => {
  await AppDataSource.initialize();

  const configsRepository = AppDataSource.getRepository(ConfigEntities);

  // Read and parse the YAML file from the global folder
  const fileContents = readFileSync('./configs.yml', 'utf8');
  const data = yaml.load(fileContents) as {
    configs: { name: string; value: string }[];
  };

  // Seed data into the database
  for (const config of data.configs) {
    await configsRepository.save(config);
  }

  console.log('Configs seeded successfully!');
  await AppDataSource.destroy();
};

seedConfigs().catch((error) => {
  console.error('Error seeding configs:', error);
});
