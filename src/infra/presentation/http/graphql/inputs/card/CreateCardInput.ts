import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCardInput {
  @Field()
  answer: string;
  @Field({ nullable: true })
  photo?: string;
  @Field({ nullable: true })
  video?: string;
  @Field()
  title: string;
  @Field()
  deckId: string;
  @Field()
  showDataTime: string;
  @Field()
  type: string;
  @Field()
  evaluation: string;
  @Field()
  times: number;
}
