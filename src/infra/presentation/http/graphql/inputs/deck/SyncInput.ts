import { InputType, Field } from '@nestjs/graphql';
import { CardInput } from '../card/CardInput';

@InputType()
export class DeckInput {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field({ nullable: true })
    photo?: string;

    @Field(() => [CardInput])
    cards: CardInput[];
}

@InputType()
export class SyncInput {
    @Field(() => [DeckInput]) 
    decks: DeckInput[];
}
