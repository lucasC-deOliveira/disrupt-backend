import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EditCardInput {
  @Field()
  answer: string;
  @Field()
  photo: string;
  @Field()
  title: string;
  @Field()
  id: string;
}
