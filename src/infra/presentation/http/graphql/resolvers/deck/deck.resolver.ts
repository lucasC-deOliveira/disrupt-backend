import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Deck } from '../../models/deck/deck';
import { DeckService } from 'src/infra/services/deck.service';
import { CreateDeckInput } from '../../inputs/deck/CreateDeckInput';
import { EditDeckInput } from '../../inputs/deck/EditDeckInput';
// import { UseGuards } from '@nestjs/common';

@Resolver(() => Deck)
export class DeckResolver {
  constructor(private decksService: DeckService) {}
  @Query(() => [Deck])
  async getAllDecks() {
    return await this.decksService.getAllDecks();
  }

  @Query(() => Deck)
  async getDeckById(@Args('id') id: string) {
    const deck = await this.decksService.getDeckById(id);
    return deck;
  }

  @Mutation(() => Deck)
  async createDeck(@Args('data') data: CreateDeckInput) {
    return await this.decksService.createDeck(data);
  }

  @Mutation(() => Deck)
  async editDeck(@Args('data') data: EditDeckInput) {
    return await this.decksService.editDeck(data);
  }

  @Mutation(() => Deck)
  async removeDeck(@Args('id') id: string) {
    return await this.decksService.removeDeck(id);
  }
}
