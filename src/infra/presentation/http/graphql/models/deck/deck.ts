import { ObjectType, Field } from "@nestjs/graphql";
import { Card } from "../card/card";
import { Optional } from "@nestjs/common";

@ObjectType()
export class Deck {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field(() => [Card])
  cards?: Card[];
}
