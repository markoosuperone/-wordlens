import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ImageModule, ObserveInstrument } from './image/image.module.js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';

async function bootstrap() {
  // The FastifyAdapter argument is what actually selects Fastify; the
  // <NestFastifyApplication> generic is only a type assertion, and without the
  // adapter Nest falls back to Express (where app.register does not exist).
  const app = await NestFactory.create<NestFastifyApplication>(
    ImageModule,
    new FastifyAdapter(),
    { instrument: ObserveInstrument },
  );
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
