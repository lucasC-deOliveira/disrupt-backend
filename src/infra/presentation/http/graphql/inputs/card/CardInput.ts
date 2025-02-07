import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CardInput {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field()
    answer: string;

    @Field()
    photo: string;

    @Field()
    showDataTime: string;

    @Field()
    evaluation: string;

    @Field()
    times: number;

    @Field()
    type:string;
}
