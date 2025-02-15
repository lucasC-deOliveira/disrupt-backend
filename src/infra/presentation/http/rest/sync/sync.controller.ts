import { Body, Controller, Logger, Post } from '@nestjs/common';
import { SyncInput } from 'src/infra/presentation/http/graphql/inputs/deck/SyncInput';
import { SyncService } from 'src/infra/services/sync.service';

@Controller(`/rest`)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('/sync')
  async syncDecksAndCards(@Body() data: SyncInput): Promise<boolean> {
    await this.syncService.execute(data);
    return true;
  }
}
