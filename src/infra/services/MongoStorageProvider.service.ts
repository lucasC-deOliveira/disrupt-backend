import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { BaseStorageProvider } from 'src/domain/modules/utils/BaseStorageProvider';


@Injectable()
export class MongoStorageProvider extends BaseStorageProvider implements OnModuleInit, OnModuleDestroy  {
  private client: MongoClient;
  private bucket: GridFSBucket;

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async onModuleInit() {
    const mongoUrl = process.env.DATABASE_URL_MONGO;
    if (!mongoUrl) {
      throw new Error('DATABASE_URL_MONGO não está definido');
    }

    this.client = new MongoClient(mongoUrl);

    try {
      await this.client.connect();
    } catch (err) {
      throw new Error(`Erro ao conectar no Mongo: ${err}`);
    }

    const db = this.client.db();
    this.bucket = new GridFSBucket(db, { bucketName: 'midia' });
  }

  async upload(filePath: string, fileBuffer: Buffer): Promise<string> {
    console.log('Uploading file to MongoDB GridFS...', filePath);

    const fileId: ObjectId = await new Promise((resolve, reject) => {
      const uploadStream = this.bucket.openUploadStream(filePath);
      uploadStream.on('finish', () => resolve(uploadStream.id as ObjectId));
      uploadStream.on('error', (error) => reject(error));
      uploadStream.end(fileBuffer);
    });

    console.log('File uploaded successfully. File ID:', fileId.toString(), filePath);

    const midia = await this.prisma.midia.create({
      data: {
        path: filePath,
        gridFsId: fileId.toString(),
        ownerId: filePath.split('/')[1],
        type: filePath.split('/')[0],
      },
    });

    return midia.path;
  }

  async getUrl(filePath: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async delete(filePath: string): Promise<void> {
    const midia = await this.prisma.midia.findUnique({
      where: { path: filePath },
    });

    if (!midia) {
      return 
    }

    const fileObjectId = new ObjectId(midia.gridFsId);
    await this.bucket.delete(fileObjectId);

    await this.prisma.midia.delete({
      where: { id: midia.id },
    });
  }

  async getBlob(filePath: string): Promise<NodeJS.ReadableStream> {
    console.log(filePath);

    const midia = await this.prisma.midia.findUnique({
      where: { path: filePath },
    });

    if (!midia) {
      throw new Error('File not found');
    }

    const fileObjectId = new ObjectId(midia.gridFsId);
    console.log('Downloading file from MongoDB GridFS...', midia.gridFsId);

    return this.bucket.openDownloadStream(fileObjectId);
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
