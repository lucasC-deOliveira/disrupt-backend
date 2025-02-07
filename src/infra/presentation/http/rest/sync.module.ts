import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { DeckService } from 'src/infra/services/deck.service';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [SyncController],
  providers: [DeckService,PrismaService],
})
export class SyncModule {}
