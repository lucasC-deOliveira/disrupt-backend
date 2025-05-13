import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Deck } from '../../models/deck/deck';
import { DeckService } from '../../../../../services/deck.service';
import { CreateDeckInput } from '../../inputs/deck/CreateDeckInput';
import { EditDeckInput } from '../../inputs/deck/EditDeckInput';
import { RedisService } from '../../../../../services/redis.service';
import { BlobStorageService } from 'src/infra/services/blobStorage.service';
import { ImportDeckAndCardsResponse } from '../../outputs/ImportDeckAndCardsResponse';
import { EncryptionService } from 'src/infra/services/encryption.service';
import { SyncService } from 'src/infra/services/sync.service';
import { SyncInput } from '../../inputs/deck/SyncInput';

@Resolver(() => Deck)
export class DeckResolver {
  constructor(
    private readonly decksService: DeckService,
    private readonly redisService: RedisService,
    private readonly blobStorageService: BlobStorageService,
    private readonly encryptionService: EncryptionService,
    private readonly syncService: SyncService
  ) { }

  @Query(() => [Deck])
  async getAllDecks(): Promise<Deck[]> {
    const hasCache = await this.redisService.get('getAllDecks');

    if (!hasCache) {
      const decks = (await this.decksService.getAllDecks()).map(deck => {
        const title = this.encryptionService.decrypt(Buffer.from(deck.title, "base64")).toString("utf-8")
        const cards = deck.cards.map(card => {
          const title = this.encryptionService.decrypt(Buffer.from(card.title, "base64")).toString("utf-8")
          const answer = this.encryptionService.decrypt(Buffer.from(card.answer, "base64")).toString("utf-8")
          return {
            ...card,
            title,
             answer
          }
        })

        return {
          ...deck,
          cards,
          title
        }
      });

      await this.redisService.set('getAllDecks', decks);
      return decks;
    }

    return hasCache.map(deck => ({
      ...deck,
      cards: deck.cards.map(card => ({
        ...card,
        showDataTime: new Date(card.showDataTime),
      })),
    }));
  }

  @Query(() => Deck)
  async getDeckById(@Args('id') id: string): Promise<Deck> {
    const hasCache = await this.redisService.get(`getDeckById${id}`);

    if (!hasCache) {
      const deck = await this.decksService.getDeckById(id);
      const title = this.encryptionService.decrypt(Buffer.from(deck.title, "base64")).toString("utf-8")
      deck.title = title
      deck.cards = deck.cards.map(card => {
          const title = this.encryptionService.decrypt(Buffer.from(card.title, "base64")).toString("utf-8")
          const answer = this.encryptionService.decrypt(Buffer.from(card.answer, "base64")).toString("utf-8")
          return {
            ...card,
            title,
             answer
          }
        })
      await this.redisService.set(`getDeckById${id}`, deck);
      return deck;
    }

    return hasCache;
  }

  @Mutation(() => Deck)
  async createDeck(@Args('data') { photo, title }: CreateDeckInput): Promise<Deck> {
    const encryptedTitle = this.encryptionService.encrypt(Buffer.from(title, "utf-8"))
    const result = await this.decksService.createDeck({ title: encryptedTitle.toString() });
    await this.blobStorageService.uploadFile(`deck/image/${result.id}`, Buffer.from(photo));
    await this.redisService.del('getAllDecks');
    await this.redisService.del(`getDeckById${result.id}`);
    return result;
  }

  @Mutation(() => Deck)
  async editDeck(@Args('data') { id, photo, title }: EditDeckInput): Promise<Deck> {
    const encryptedTitle = this.encryptionService.encrypt(Buffer.from(title, "utf-8"))
    const result = await this.decksService.editDeck({ id, title: encryptedTitle.toString() });
    await this.blobStorageService.deleteFile(`deck/image/${id}`);
    await this.blobStorageService.uploadFile(`deck/image/${result.id}`, Buffer.from(photo));
    await this.redisService.del('getAllDecks');
    await this.redisService.del(`getDeckById${id}`);
    await this.redisService.del(`getAllCardsByDeckid${id}`);
    return result;
  }

  @Mutation(() => Deck)
  async removeDeck(@Args('id') id: string): Promise<Deck> {
    const result = await this.decksService.removeDeck(id);
    await this.blobStorageService.deleteFile(`deck/image/${id}`);
    await this.redisService.del('getAllDecks');
    await this.redisService.del(`getDeckById${id}`);
    await this.redisService.del(`getAllCardsByDeckid${id}`);
    return result;
  }

  @Mutation(() => ImportDeckAndCardsResponse)
  async importDecks(@Args('data') data: SyncInput): Promise<ImportDeckAndCardsResponse> {

    await this.syncService.execute(data);


    const response = {
      status: 201,
      message: "baralho importado com sucesso!",
    }

    return response
  }
}
