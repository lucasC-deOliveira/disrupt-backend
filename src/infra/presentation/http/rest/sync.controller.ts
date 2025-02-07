import { Body, Controller, Logger, Post } from '@nestjs/common';
import { DeckService } from 'src/infra/services/deck.service';
import { SyncInput } from 'src/infra/presentation/http/graphql/inputs/deck/SyncInput';

@Controller(`/rest`)
export class SyncController {
  constructor(private readonly deckService: DeckService) {}

  @Post('/sync')
  async syncDecksAndCards(@Body() data: SyncInput): Promise<boolean> {
    await this.deckService.syncDecksAndCards(data);
    return true;
  }
}
