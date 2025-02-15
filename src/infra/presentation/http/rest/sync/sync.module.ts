import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { DeckService } from 'src/infra/services/deck.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CardService } from 'src/infra/services/card.service';
import { BlobStorageService } from 'src/infra/services/blobStorage.service';
import { MongoStorageProvider } from 'src/infra/services/MongoStorageProvider.service';
import { AddSecondssDayjs } from 'src/infra/utils/AddSecondsDayjs/AddSecondsDayjs';
import { LocalStorageProvider } from 'src/infra/services/localStorageProvider.service';
import { ConfigService } from '@nestjs/config';
import { SyncService } from 'src/infra/services/sync.service';

@Module({
  imports: [],
  controllers: [SyncController],
  providers: [DeckService, PrismaService, CardService, BlobStorageService, MongoStorageProvider, AddSecondssDayjs, LocalStorageProvider, ConfigService, SyncService],
})
export class SyncModule { }
