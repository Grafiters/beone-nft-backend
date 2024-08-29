import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntities } from '@db/entity/users.entity';
import { UserService } from '@db/models/user/user.service';
import { UserEntitiesRepository } from '@db/models/user/user.repository';

@Module({
  imports: [
    UserEntitiesRepository,
    TypeOrmModule.forFeature([UserEntities]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database').host,
        port: configService.get('database').port,
        username: configService.get('database').username,
        password: configService.get('database').password,
        database: configService.get('database').database,
        entities: configService.get('database').entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class DatabaseModule {}
