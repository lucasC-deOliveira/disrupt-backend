import { Module } from '@nestjs/common';
import { DeckService } from 'src/infra/services/deck.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MediaController } from './media.controller';
import { BlobStorageService } from 'src/infra/services/blobStorage.service';
import { ConfigService } from '@nestjs/config';
import { LocalStorageProvider } from 'src/infra/services/localStorageProvider.service';
import { MongoStorageProvider } from 'src/infra/services/MongoStorageProvider.service';
import { EncryptionService } from 'src/infra/services/encryption.service';

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [DeckService,PrismaService, BlobStorageService,ConfigService, LocalStorageProvider, MongoStorageProvider,EncryptionService],
})
export class MediaModule {}
