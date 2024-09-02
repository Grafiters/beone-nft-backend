import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './database.config';
import { rpcConfig } from './rpc.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, rpcConfig],
    }),
    DatabaseModule,
  ],
  exports: [ConfigModule],
})
export class ConfigsModule {}
