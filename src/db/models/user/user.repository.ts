// user-entities.repository.ts
import { UserEntities } from '@db/entity/users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserEntities)
export class UserEntitiesRepository extends Repository<UserEntities> {}
