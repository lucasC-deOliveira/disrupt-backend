import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EditCardInput {
  @Field()
  answer: string;
  @Field({ nullable: true })
  photo?: string;
  @Field({ nullable: true })
  video?: string;
  @Field()
  title: string;
  @Field()
  id: string;
}
