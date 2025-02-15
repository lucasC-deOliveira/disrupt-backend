export abstract class BaseStorageProvider {
    async upload(filePath: string, fileBuffer: Buffer): Promise<string> {
      throw new Error('Method not implemented.');
    }
    async getUrl(filePath: string): Promise<string> {
      throw new Error('Method not implemented.');
    }
    async delete(filePath: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    async getBlob(filePath: string): Promise<NodeJS.ReadableStream> {
      throw new Error('Method not implemented.');
    }
}