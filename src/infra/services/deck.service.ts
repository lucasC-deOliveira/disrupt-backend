import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { EditDeckInput } from '../presentation/http/graphql/inputs/deck/EditDeckInput';
import { SyncInput } from '../presentation/http/graphql/inputs/deck/SyncInput';

interface CreateDeckInput {
  title: string,
  id?: string
}
@Injectable()
export class DeckService {
  constructor(private prisma: PrismaService) { }

  getAllDecks() {
    return this.prisma.deck.findMany({
      include: { cards: true },
    });
  }

  getDeckById(id: string) {
    return this.prisma.deck.findUnique({
      where: {
        id,
      },
      include: { cards: true },
    });
  }

  async createDeck({ title, id }: CreateDeckInput) {
    return this.prisma.deck.create({
      data: {
        id,
        title,
      },
    });
  }
  async editDeck({ title, id }: EditDeckInput) {
    return await this.prisma.deck.update({
      where: { id: id },
      data: {
        title,
      },
      include: { cards: true },
    });
  }
  async removeDeck(id: string) {
    const deck = await this.prisma.deck.findUnique({ where: { id } });
    if (!!deck) {
      await this.prisma.deck.delete({
        where: { id: id },
        include: { cards: true },
      });
    }
    return deck;
  }


  async syncDecksAndCards(data: SyncInput) {
    for (const deck of data.decks) {
      const savedDeck = await this.prisma.deck.upsert({
        where: { id: deck.id },
        update: { title: deck.title },
        create: { id: deck.id, title: deck.title },
      });

      for (const card of deck.cards) {
        await this.prisma.card.upsert({
          where: { id: card.id },
          update: {
            title: card.title,
            answer: card.answer,
            showDataTime: new Date(card.showDataTime),
            evaluation: card.evaluation,
            times: card.times
          },
          create: {
            id: card.id,
            title: card.title,
            answer: card.answer,
            showDataTime: new Date(card.showDataTime),
            evaluation: card.evaluation,
            times: card.times,
            type: card.type,
            deckId: savedDeck.id
          },
        });
      }
    }
  }
}
