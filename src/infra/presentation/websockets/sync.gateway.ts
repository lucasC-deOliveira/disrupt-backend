import { WebSocketGateway, WebSocketServer, SubscribeMessage, WsResponse, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DeckService } from 'src/infra/services/deck.service';
import { SyncInput } from 'src/infra/presentation/http/graphql/inputs/deck/SyncInput';
import { from, map, Observable } from 'rxjs';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    maxHttpBufferSize: 1e10,
})
export class SyncGateway {
    constructor(private readonly deckService: DeckService) { }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('syncDecksAndCards')
    async handleSyncDecksAndCards(client: any, payload: SyncInput): Promise<any> {
        console.log('WebSocket syncDecksAndCards called', payload);
        await this.deckService.syncDecksAndCards(payload);   
        // const response = { success: true };
        // return response
    }

}