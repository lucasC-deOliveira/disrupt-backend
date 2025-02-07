import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateDeckInput } from 'src/domain/input/deck/CreateDeckInput';
import { EditDeckInput } from '../presentation/http/graphql/inputs/deck/EditDeckInput';
import { Deck } from '@prisma/client';
import { SyncInput } from '../presentation/http/graphql/inputs/deck/SyncInput';

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

  async createDeck({ photo, title }: CreateDeckInput) {
    return this.prisma.deck.create({
      data: {
        photo,
        title,
      },
    });
  }
  async editDeck({ photo, title, id }: EditDeckInput) {
    return await this.prisma.deck.update({
      where: { id: id },
      data: {
        photo,
        title,
      },
    });
  }
  async removeDeck(id: string) {
    const deck = await this.prisma.deck.findUnique({ where: { id } });
    if (!!deck) {
      await this.prisma.deck.delete({
        where: { id: id },
      });
    }
    return deck;
  }


  async syncDecksAndCards(data: SyncInput) {
    for (const deck of data.decks) {
      const savedDeck = await this.prisma.deck.upsert({
        where: { id: deck.id },
        update: { title: deck.title, photo: deck.photo },
        create: { id: deck.id, title: deck.title, photo: deck.photo },
      });

      for (const card of deck.cards) {
        await this.prisma.card.upsert({
          where: { id: card.id },
          update: {
            title: card.title,
            answer: card.answer,
            photo: card.photo,
            showDataTime: new Date(card.showDataTime),
            evaluation: card.evaluation,
            times: card.times
          },
          create: {
            id: card.id,
            title: card.title,
            answer: card.answer,
            photo: card.photo,
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
