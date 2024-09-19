import { ConfigEntities } from '@db/entity/configs.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigEntitiesRepository } from './config.repository';

@Injectable()
export class ConfigServices {
  private readonly logger = new Logger(ConfigServices.name);

  constructor(
    @InjectRepository(ConfigEntities)
    private readonly configRepository: ConfigEntitiesRepository,
  ) {}

  async fetchConfig(): Promise<ConfigEntities[] | []> {
    const configData = await this.configRepository.find();
    return configData.length > 0 ? configData : [];
  }

  async createConfig(name: string, value: string) {
    this.logger.debug('create new data config');
    const validaten = this.findConfig(name);
    if (validaten) {
      const config = this.configRepository.create({ name: name, value: value });
      return await this.configRepository.save(config);
    } else {
      return null;
    }
  }

  async findConfig(name: string): Promise<ConfigEntities | null> {
    this.logger.debug('find config data by name');
    return await this.configRepository.findOneBy({
      name: name,
    });
  }
}
