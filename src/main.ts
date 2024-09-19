import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import logger from './pino-logger';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerConfigModule } from '@swagger/swagger.module';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors'; // Import Fastify CORS

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    maxParamLength: 1024 * 64, // 64 KiB
    bodyLimit: 1024 * 1024 * 8, // 8 MiB
    logger,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    { rawBody: true },
  );

  const jwtPrivateKey = Buffer.from(
    process.env.JWT_PRIVATE_KEY,
    'base64',
  ).toString('utf-8');

  app.register(fastifyCookie, {
    secret: jwtPrivateKey,
  });

  app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false,
  });

  SwaggerConfigModule.setupSwagger(app);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
