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

  async createOrUpdateUser(
    address: string,
    provider: string,
    chainId: number,
  ): Promise<UserEntities> {
    this.logger.debug(`update user data ${address}`);
    let user = await this.findUserByAddress(address);
    if (user) {
      user = this.userRepository.merge(user, {
        address: address,
        provider: provider,
        chainId: chainId,
      });
    } else {
      user = this.userRepository.create({
        address: address,
        provider: provider,
        chainId: chainId,
      });
    }
    return await this.userRepository.save(user);
  }

  async findUserByID(id: number): Promise<UserEntities | null> {
    this.logger.debug(`find user by id ${id}`);
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async findUserByAddress(address: string): Promise<UserEntities | null> {
    this.logger.debug(`find user by ${address}`);
    return await this.userRepository.findOne({ where: { address: address } });
  }
}
