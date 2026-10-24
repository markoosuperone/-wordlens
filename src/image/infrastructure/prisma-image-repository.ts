import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ImageStatus } from '@prisma/client';
import { ImageRepository } from '@/image/ports/image.repository.js';
import { PrismaService } from '@/prisma/prisma.service.js';

@Injectable()
export class ImagePrismaRepository implements ImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async postImage(id: string, image: Buffer): Promise<string> {
    // The schema has no column for the bytes themselves, so only the metadata
    // row is written here; the buffer still needs to go to object storage.
    // `width`/`height` stay 0 until the OCR step fills them in alongside the
    // words, which is also when `status` moves off PROCESSING.
    const digest = createHash('sha256')
      .update(image)
      .digest('hex')
      .slice(0, 12);

    const created = await this.prisma.image.create({
      data: {
        id: id,
        filename: `upload-${digest}`,
        status: ImageStatus.PROCESSING,
        width: 0,
        height: 0,
      },
      select: { id: true },
    });

    return created.id;
  }

  async getImageById(id: string): Promise<string | null> {
    const image = await this.prisma.image.findUnique({
      where: { id },
      select: { filename: true },
    });

    return image?.filename ?? null;
  }

  async getAllImages(): Promise<string[]> {
    const images = await this.prisma.image.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    return images.map((image) => image.id);
  }
  async updateStatus(id: string, status: ImageStatus): Promise<void> {
    await this.prisma.image.update({
      where: { id },
      data: { status },
    });
  }

  async deleteImage(id: string): Promise<void> {
    await this.prisma.image.delete({
      where: { id },
    });
  }
}
