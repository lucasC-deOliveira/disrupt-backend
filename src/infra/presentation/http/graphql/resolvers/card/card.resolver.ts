import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Card } from '../../models/card/card';
import { CardService } from 'src/infra/services/card.service';
import { CreateCardInput } from '../../inputs/card/CreateCardInput';
import { AnwerCardInput } from '../../inputs/card/AnwerCardInput';
// import { UseGuards } from '@nestjs/common';

@Resolver(() => Card)
export class CardResolver {
  constructor(private cardsService: CardService) {}
  @Query(() => [Card])
  async getAllCardsByDeckid(
    @Args('id') id: string,
    @Args('itemsPerPage', { type: () => String, nullable: true })
    itemsPerPage?: string,
    @Args('page', { type: () => String, nullable: true }) page?: string,
  ) {
    const result = await this.cardsService.getAllCardByDeckId(
      id,
      Number(itemsPerPage),
      Number(page),
    );
    console.log('card', result);
    return result;
  }
  @Mutation(() => Card)
  createCard(@Args('data') data: CreateCardInput) {
    return this.cardsService.createCard(data);
  }

  @Mutation(() => Card)
  answerCard(@Args('data') data: AnwerCardInput) {
    this.cardsService.AnswerCard(data);
    return this.cardsService.getCardById(data.id);
  }
}
