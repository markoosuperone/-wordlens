export const IMAGE_REPOSITORY = Symbol('IMAGE_REPOSITORY');
import { ImageStatus } from '@prisma/client';

export type ImageRepository = {
  postImage(id: string, image: Buffer): Promise<string>;
  getImageById(id: string): Promise<string | null>;
  getAllImages(): Promise<string[]>;
  updateStatus(id: string, status: ImageStatus): Promise<void>;
  deleteImage(id: string): Promise<void>;
}