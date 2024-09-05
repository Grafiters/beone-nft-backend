// user-entities.repository.ts
import { ConfigEntities } from '@db/entity/configs.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ConfigEntities)
export class ConfigEntitiesRepository extends Repository<ConfigEntities> {}
