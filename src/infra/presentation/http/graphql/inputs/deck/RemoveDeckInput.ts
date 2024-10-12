import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveDeckInput {
  @Field()
  id: string;
}
