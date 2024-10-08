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
import { SwaggerConfigModule } from './swagger/swagger.module';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import databaseConfig from '@configs/database.config';
import { rpcConfig } from '@configs/rpc.config';
import { JwtServices } from './services/jwt/jwt.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@services/jwt/jwt.strategy';
import { UsersController } from './controllers/users/users.controller';
import { ConfigEntities } from '@db/entity/configs.entity';
import { ConfigServices } from './db/models/config/config.service';
import { BlockchainService } from './services/blockchain/blockchain.service';
import { ContractsService } from './services/contracts/contracts.service';
import { ProfileEntities } from '@db/entity/profile.entity';

export const entities = [UserEntities, ConfigEntities, ProfileEntities];
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
        entities: entities,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, rpcConfig],
    }),
    PassportModule,
    JwtModule.register({
      publicKey: process.env.JWT_PUBLIC_KEY,
      privateKey: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        expiresIn: '2h',
      },
    }),
    SwaggerConfigModule,
  ],
  controllers: [
    AppController,
    PublicController,
    AuthController,
    UsersController,
  ],
  providers: [
    AppService,
    UserService,
    AuthService,
    JwtServices,
    JwtStrategy,
    ConfigServices,
    BlockchainService,
    ContractsService,
  ],
})
export class AppModule {}
