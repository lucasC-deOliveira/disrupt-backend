import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Deck } from '../../models/deck/deck';
import { DeckService } from 'src/infra/services/deck.service';
import { CreateDeckInput } from '../../inputs/deck/CreateDeckInput';
import { EditDeckInput } from '../../inputs/deck/EditDeckInput';
import { RedisService } from 'src/infra/services/redis.service';
// import { UseGuards } from '@nestjs/common';

@Resolver(() => Deck)
export class DeckResolver {
  constructor(
    private decksService: DeckService,
    private redisService: RedisService,
  ) { }

  @Query(() => [Deck])
  async getAllDecks() {
    const hasCache = await this.redisService.get('getAllDecks');

    if (!hasCache) {
      const decks = await this.decksService.getAllDecks();
      // converter o campo showDataTime de cada card para um objeto Date
      const decksWithDate = decks.map(deck => ({
        ...deck,
        cards: deck.cards.map(card => ({
          ...card,
          showDataTime: new Date(card.showDataTime),
        })),
      }));
      await this.redisService.set('getAllDecks', decksWithDate);
      return decksWithDate;
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
  async getDeckById(@Args('id') id: string) {
    const hasCache = await this.redisService.get('getDeckById' + id);
    console.log(hasCache);
    if (!hasCache) {
      const deck = await this.decksService.getDeckById(id);
      await this.redisService.set('getDeckById' + id, deck);
      return deck;
    }
    return hasCache;
  }

  @Mutation(() => Deck)
  async createDeck(@Args('data') data: CreateDeckInput) {

    const result = await this.decksService.createDeck(data);

    await this.redisService.del('getAllDecks');
    await this.redisService.del('getDeckById' + result.id);

    return result;
  }

  @Mutation(() => Deck)
  async editDeck(@Args('data') data: EditDeckInput) {
    const result = await this.decksService.editDeck(data);
    await this.redisService.del('getAllDecks');
    await this.redisService.del('getDeckById' + data.id);
    await this.redisService.del('getAllCardsByDeckid' + data.id);

    return result;

  }

  @Mutation(() => Deck)
  async removeDeck(@Args('id') id: string) {
    const result = await this.decksService.removeDeck(id);
    await this.redisService.del('getAllDecks');
    await this.redisService.del('getDeckById' + id);
    await this.redisService.del('getAllCardsByDeckid' + id);

    return result;
  }


}
