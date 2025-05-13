import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
class CardImportInput {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  answer: string;

  @Field()
  showDataTime: string;

  @Field()
  evaluation: string;

  @Field(() => Int)
  times: number;
}

@InputType()
export class DeckImportInput {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  photo: string;

  @Field(() => [CardImportInput])
  cards: CardImportInput[];
}