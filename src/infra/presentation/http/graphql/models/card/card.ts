import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Card {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  photo: string;

  @Field()
  answer: string;

  @Field()
  times: number;

  @Field()
  evaluation: string;

  @Field()
  showDataTime: Date;
}
