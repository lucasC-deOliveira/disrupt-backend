import { Module } from '@nestjs/common';
import { SyncGateway } from './sync.gateway';
import { DeckService } from 'src/infra/services/deck.service';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Module({
  providers: [SyncGateway, DeckService, PrismaService],
})
export class WebsocketsModule {}
