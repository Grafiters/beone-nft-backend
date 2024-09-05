import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntities } from '@db/entity/users.entity';
import { UserService } from '@db/models/user/user.service';
import { UserEntitiesRepository } from '@db/models/user/user.repository';
import { ConfigEntitiesRepository } from '@db/models/config/config.repository';
import { ConfigEntities } from '@db/entity/configs.entity';
import { ConfigServices } from '@db/models/config/config.service';
import { StakedContractEntities } from '@db/entity/staked_contract.entity';

export const entities = [UserEntities, StakedContractEntities, ConfigEntities];
@Module({
  imports: [
    UserEntitiesRepository,
    ConfigEntitiesRepository,
    TypeOrmModule.forFeature(entities),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database').host,
        port: configService.get('database').port,
        username: configService.get('database').username,
        password: configService.get('database').password,
        database: configService.get('database').database,
        entities: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, ConfigServices],
  exports: [UserService, ConfigServices],
})
export class DatabaseModule {}
