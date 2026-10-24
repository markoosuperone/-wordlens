import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
// Needed for its own sake: this import is what pulls @fastify/multipart's
// `declare module 'fastify'` augmentation (req.file, req.isMultipart, ...)
// into this file. Registering the plugin in main.ts is not enough for types.
import '@fastify/multipart';

import { ImageService } from './image.service.js';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  async postImage(@Req() req: FastifyRequest): Promise<string> {
    // Stream mode: main.ts registers @fastify/multipart without
    // `attachFieldsToBody`, so the upload arrives via req.file() and never
    // shows up on req.body.
    const file = await req.file();

    if (!file) {
      throw new BadRequestException(
        'Expected a multipart/form-data request containing a file.',
      );
    }

    return this.imageService.postImage(await file.toBuffer());
  }

  @Get(':id')
  getImage(@Param('id') id: string): Promise<string | null> {
    return this.imageService.getImageById(id);
  }

  @Get()
  getAllImages(): Promise<string[]> {
    return this.imageService.getAllImages();
  }
}
