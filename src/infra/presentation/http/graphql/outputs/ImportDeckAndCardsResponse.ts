import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Deck } from "../models/deck/deck";

@ObjectType()
export class ImportDeckAndCardsResponse {
  @Field(() => Int)
  status: number;

  @Field()
  message: string;


}
