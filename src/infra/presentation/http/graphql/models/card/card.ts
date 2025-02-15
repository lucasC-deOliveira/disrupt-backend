import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class Card {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  photo?: string;

  @Field({ nullable: true })
  video?: string;

  @Field()
  answer: string;

  @Field()
  times: number;

  @Field()
  evaluation: string;

  @Field()
  showDataTime: Date;

  @Field()
  type: string;

  @Field()
  deckId: string;
}
