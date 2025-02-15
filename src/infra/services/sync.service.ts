import { Injectable } from '@nestjs/common';
import { BlobStorageService } from './blobStorage.service';
import { SyncInput } from '../presentation/http/graphql/inputs/deck/SyncInput';
import { DeckService } from './deck.service';
import { CardService } from './card.service';

@Injectable()
export class SyncService {
    constructor(
        private readonly blobStorageService: BlobStorageService,
        private readonly deckService: DeckService,
        private cardsService: CardService,

    ) { }

    async execute({ decks }: SyncInput) {
        for (const deck of decks) {
            const { id, title, photo, cards } = deck;
            const deckExists = await this.deckService.getDeckById(id);

            if (deckExists) {
                await this.deckService.editDeck({ id, title });
                if (photo) {
                    await this.blobStorageService.deleteFile(`deck/image/${id}`);
                    await this.blobStorageService.uploadFile(`deck/image/${id}`, Buffer.from(photo));
                }
            } else {
                await this.deckService.createDeck({ id, title });
                if (photo) {
                    await this.blobStorageService.uploadFile(`deck/image/${id}`, Buffer.from(photo));
                }
            }

            for (const card of cards) {
                const { id, answer, evaluation, times, title, type, photo, video, deckId, showDataTime } = card;

                const cardExists = await this.cardsService.getCardById(id);

                if (cardExists) {
                    await this.cardsService.editCard({ id, answer, evaluation, times, title, type, deckId, showDataTime });
                    if ((type == 'image' && video) || (photo && type == 'image')) {
                        await this.blobStorageService.deleteFile(`${type}/${id}`)
                        await this.blobStorageService.uploadFile(`${type}/${id}`, Buffer.from(type == 'image' ? photo : video));
                    }
                } else {
                    await this.cardsService.createCard({ id, answer, evaluation, times, title, type, deckId, showDataTime });
                    if ((type == 'image' && video) || (photo && type == 'image')) {
                        await this.blobStorageService.uploadFile(`${type}/${id}`, Buffer.from(type == 'image' ? photo : video));
                    }
                }
            }
        }
    }

}
