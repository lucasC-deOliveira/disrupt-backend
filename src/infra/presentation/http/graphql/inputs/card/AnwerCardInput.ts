import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AnwerCardInput {
  @Field()
  evaluation?: string;
  @Field()
  id: string;
}
