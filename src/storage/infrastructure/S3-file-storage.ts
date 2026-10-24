import { FileStorage } from '../ports/file-storage.repository.js';
import { S3Service } from '../S3.service.js';

export class S3FileStorage implements FileStorage {
  constructor(private readonly s3Service: S3Service) {}

  upload(key: string, body: Buffer, contentType: string): Promise<void> {
    this.s3Service.upload(key, body, contentType);
    return Promise.resolve();
  }
  download(key: string): Promise<Buffer> {
    this.s3Service.download(key);
    return Promise.resolve(Buffer.from([]));
  }
  getUrl(key: string): Promise<string> {
    this.s3Service.getSignedUrl(key);
    return Promise.resolve('');
  }
  delete(key: string): Promise<void> {
    this.s3Service.delete(key);
    return Promise.resolve();
  }
}
