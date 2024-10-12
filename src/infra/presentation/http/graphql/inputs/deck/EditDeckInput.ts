import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EditDeckInput {
  @Field()
  title: string;
  @Field()
  photo: string;
  @Field()
  id: string;
}
