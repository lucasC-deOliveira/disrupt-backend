import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Deck } from '../../models/deck/deck';
import { DeckService } from '../../../../../services/deck.service';
import { CreateDeckInput } from '../../inputs/deck/CreateDeckInput';
import { EditDeckInput } from '../../inputs/deck/EditDeckInput';
import { RedisService } from '../../../../../services/redis.service';
import { BlobStorageService } from 'src/infra/services/blobStorage.service';

@Resolver(() => Deck)
export class DeckResolver {
  constructor(
    private readonly decksService: DeckService,
    private readonly redisService: RedisService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Query(() => [Deck])
  async getAllDecks(): Promise<Deck[]> {
    const hasCache = await this.redisService.get('getAllDecks');

    if (!hasCache) {
      const decks = await this.decksService.getAllDecks();
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
      await this.redisService.set(`getDeckById${id}`, deck);
      return deck;
    }

    return hasCache;
  }

  @Mutation(() => Deck)
  async createDeck(@Args('data') data: CreateDeckInput): Promise<Deck> {
    const result = await this.decksService.createDeck(data);
    await this.redisService.del('getAllDecks');
    await this.redisService.del(`getDeckById${result.id}`);
    return result;
  }

  @Mutation(() => Deck)
  async editDeck(@Args('data') data: EditDeckInput): Promise<Deck> {
    const result = await this.decksService.editDeck(data);
    await this.redisService.del('getAllDecks');
    await this.redisService.del(`getDeckById${data.id}`);
    await this.redisService.del(`getAllCardsByDeckid${data.id}`);
    return result;
  }

  @Mutation(() => Deck)
  async removeDeck(@Args('id') id: string): Promise<Deck> {
    const result = await this.decksService.removeDeck(id);
    await this.redisService.del('getAllDecks');
    await this.redisService.del(`getDeckById${id}`);
    await this.redisService.del(`getAllCardsByDeckid${id}`);
    return result;
  }
}
