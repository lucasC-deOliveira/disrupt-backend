import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateDeckInput } from 'src/domain/input/deck/CreateDeckInput';
import { EditDeckInput } from '../presentation/http/graphql/inputs/deck/EditDeckInput';

@Injectable()
export class DeckService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.deck.update({
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
}
