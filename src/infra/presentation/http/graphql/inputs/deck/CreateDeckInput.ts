import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDeckInput {
  @Field()
  title: string;
  @Field()
  photo: string;
}
