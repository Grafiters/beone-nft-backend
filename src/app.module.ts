import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicController } from './controllers/public/public.controller';
import { ConfigsModule } from './configs/configs.module';
import { DatabaseModule } from '@configs/database/database.module';
import { UserEntities } from '@db/entity/users.entity';
import { UserService } from './db/models/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '@configs/database.config';

export const entities = [UserEntities];
@Module({
  imports: [
    DatabaseModule,
    ConfigsModule,
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
    TypeOrmModule.forFeature([UserEntities]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
  ],
  controllers: [AppController, PublicController],
  providers: [AppService, UserService],
})
export class AppModule {}
