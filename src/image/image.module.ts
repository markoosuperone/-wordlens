import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';

import { ImageService } from './image.service.js';
import { ImagePrismaRepository } from './infrastructure/prisma-image-repository.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ImageController } from './image.controller.js';
import { IMAGE_REPOSITORY } from './ports/image.repository.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'image-translator',
    }),
  ],
  controllers: [ImageController],
  providers: [
    PrismaService,
    ImageService,
    {
      provide: IMAGE_REPOSITORY,
      useClass: ImagePrismaRepository,
    },
  ],
})
export class ImageModule {}
