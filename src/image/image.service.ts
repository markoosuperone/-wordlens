import { Injectable, Inject } from '@nestjs/common';
import {
  IMAGE_REPOSITORY,
  type ImageRepository,
} from './ports/image.repository.js';
import { type FileStorage } from '@/storage/ports/file-storage.repository.js';

@Injectable()
export class ImageService {
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly ImageRepository: ImageRepository,
    private readonly fileStorage: FileStorage,
  ) {}
  postImage(image: Buffer): Promise<string> {
    const id = crypto.randomUUID();
    const checkImageType = (buffer: Buffer): string | null => {
      // Check for JPEG magic numbers
      if (
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[buffer.length - 2] === 0xff &&
        buffer[buffer.length - 1] === 0xd9
      ) {
        return 'image/jpeg';
      }
      // Check for PNG magic numbers
      if (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
      ) {
        return 'image/png';
      }
      // Check for JP magic numbers
      if (
        buffer[0] === 0x47 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x38
      ) {
        return 'image/gif';
      }
      return null;
    };
    if (!checkImageType(image)) {
      throw new Error('Invalid image type');
    }
    const imageType = image[0] === 0xff ? 'image/jpeg' : 'image/png';
    this.fileStorage.upload(id, image, imageType);
    return this.ImageRepository.postImage(id, image);
  }
  getImageById(imageId: string): Promise<string | null> {
    return this.ImageRepository.getImageById(imageId);
  }
  getAllImages(): Promise<string[]> {
    return this.ImageRepository.getAllImages();
  }
}
