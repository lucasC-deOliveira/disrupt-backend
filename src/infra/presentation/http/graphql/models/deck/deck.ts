import { ObjectType, Field } from '@nestjs/graphql';
import { Card } from '../card/card';

@ObjectType()
export class Deck {
  @Field()
  id: string;

  @Field()
  photo: string;

  @Field()
  title: string;

  @Field(() => [Card])
  cards: Card[];
}
