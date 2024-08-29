import { UserEntities } from '@db/entity/users.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntitiesRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntities)
    private readonly userRepository: UserEntitiesRepository,
  ) {}
}
