import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CardInput {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field()
    answer: string;

    @Field({ nullable: true })
    photo?: string;

    @Field({ nullable: true })
    video?: string;

    @Field()
    showDataTime: string;

    @Field()
    evaluation: string;

    @Field()
    times: number;

    @Field()
    type: string;
}
