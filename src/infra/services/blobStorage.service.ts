import { Injectable, Inject } from '@nestjs/common';
import { MongoStorageProvider } from './MongoStorageProvider.service';
import { LocalStorageProvider } from './localStorageProvider.service';
import { EncryptionService } from './encryption.service'; // Importa o novo serviço
import { Readable } from 'stream';

@Injectable()
export class BlobStorageService {
  private provider: LocalStorageProvider | MongoStorageProvider;

  constructor(
    @Inject(LocalStorageProvider) private readonly localProvider: LocalStorageProvider,
    @Inject(MongoStorageProvider) private readonly mongoProvider: MongoStorageProvider,
    private readonly encryptionService: EncryptionService, // Injeta o serviço
  ) {
    const providerType = process.env.STORAGE_PROVIDER;
    this.provider = this.getProviderInstance(providerType);
  }

  private getProviderInstance(providerType?: string): LocalStorageProvider | MongoStorageProvider {
    return providerType === 'local' ? this.localProvider : this.mongoProvider;
  }

  async uploadFile(filePath: string, fileBuffer: Buffer): Promise<string> {
    const encrypted = this.encryptionService.encrypt(fileBuffer);
    return this.provider.upload(filePath, encrypted);
  }

  async getFileUrl(filePath: string): Promise<string> {
    return this.provider.getUrl(filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    return this.provider.delete(filePath);
  }

  async getBlob(filePath: string): Promise<NodeJS.ReadableStream> {
    const encryptedStream = await this.provider.getBlob(filePath);
    const chunks: Buffer[] = [];
    for await (const chunk of encryptedStream) {
      chunks.push(chunk as Buffer);
    }
    const encryptedBuffer = Buffer.concat(chunks);
    const decryptedBuffer = this.encryptionService.decrypt(encryptedBuffer);
    // console.log(decryptedBuffer.toString()); 

    return Readable.from(decryptedBuffer);
  }
}
