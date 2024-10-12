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
    console.log(deck);
    return deck;
  }

  @Mutation(() => Deck)
  createDeck(@Args('data') data: CreateDeckInput) {
    return this.decksService.createDeck(data);
  }

  @Mutation(() => Deck)
  editDeck(@Args('data') data: EditDeckInput) {
    return this.decksService.editDeck(data);
  }

  @Mutation(() => Deck)
  removeDeck(@Args('id') id: string) {
    return this.decksService.removeDeck(id);
  }
}
