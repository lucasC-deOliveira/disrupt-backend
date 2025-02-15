import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoStorageProvider } from './MongoStorageProvider.service';
import { LocalStorageProvider } from './localStorageProvider.service';

@Injectable()
export class BlobStorageService {
  private provider: LocalStorageProvider | MongoStorageProvider;

  constructor(
    private readonly configService: ConfigService,
    @Inject(LocalStorageProvider) private readonly localProvider: LocalStorageProvider,
    @Inject(MongoStorageProvider) private readonly mongoProvider: MongoStorageProvider,
  ) {
    const providerType = this.configService.get<string>('STORAGE_PROVIDER');
    this.provider = this.getProviderInstance(providerType);
  }

  private getProviderInstance(providerType?: string): LocalStorageProvider | MongoStorageProvider {
    return providerType === 'local' ? this.localProvider : this.mongoProvider;
  }

  async uploadFile(filePath: string, fileBuffer: Buffer): Promise<string> {
    return this.provider.upload(filePath, fileBuffer);
  }

  async getFileUrl(filePath: string): Promise<string> {
    return this.provider.getUrl(filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    return this.provider.delete(filePath);
  }

  async getBlob(filePath: string): Promise<NodeJS.ReadableStream> {
    return this.provider.getBlob(filePath);
  }
}
