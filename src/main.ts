import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import logger from './pino-logger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

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
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
