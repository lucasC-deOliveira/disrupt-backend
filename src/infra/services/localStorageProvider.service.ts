import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { BaseStorageProvider } from 'src/domain/modules/utils/BaseStorageProvider';

@Injectable()
export class LocalStorageProvider extends BaseStorageProvider {
  private readonly storagePath: string;

  constructor() {
    // Definindo o caminho para a pasta de arquivos
    super();
    this.storagePath = path.join(__dirname, '../../../files');

    // Criando a pasta se não existir
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  // Função para fazer o upload de um arquivo
  async upload(filePath: string, fileBuffer: Buffer): Promise<string> {
    const fullPath = path.join(this.storagePath, filePath);

    // Escrevendo o arquivo no sistema de arquivos
    await fs.promises.writeFile(fullPath, fileBuffer);
    return fullPath;
  }

  // Função para obter a URL de um arquivo
  async getUrl(filePath: string): Promise<string> {
    const fullPath = path.join(this.storagePath, filePath);

    // Verificando se o arquivo existe
    if (!fs.existsSync(fullPath)) {
      throw new Error('File not found');
    }

    return `file://${fullPath}`;
  }

  // Função para deletar um arquivo
  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.storagePath, filePath);

    // Verificando se o arquivo existe e deletando-o
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }

  // Função para obter o arquivo como um stream (Blob)
  async getBlob(filePath: string): Promise<NodeJS.ReadableStream> {
    const fullPath = path.join(this.storagePath, filePath);

    // Verificando se o arquivo existe
    if (!fs.existsSync(fullPath)) {
      throw new Error('File not found');
    }

    return fs.createReadStream(fullPath);
  }
}
