import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AnwerCardInput } from '../presentation/http/graphql/inputs/card/AnwerCardInput';
import { AddSecondssDayjs } from '../utils/AddSecondsDayjs/AddSecondsDayjs';
import { evalStrategy } from 'src/domain/modules/utils/StrategyEvaluationTime';

interface CreateCardInput {
  id?: string;
  title: string;
  answer: string;
  deckId: string;
  showDataTime: string;
  type: string;
  evaluation: string;
  times: number;
}

interface EditCardInput {
  id: string;
  answer?: string;
  title?: string;
  deckId?: string;
  showDataTime?: string;
  type?: string;
  evaluation?: string;
  times?: number;
}

@Injectable()
export class CardService {
  constructor(
    private prisma: PrismaService,
    private addSecondssDayjs: AddSecondssDayjs,
  ) { }

  getAllCardByDeckId(deckId: string, itemsPerPage = null, page = null) {
    // Definindo valores padrão se paginação não for especificada
    let skip = undefined;
    let take = undefined;

    if (itemsPerPage !== null && page !== null) {
      skip = (page - 1) * itemsPerPage;
      take = itemsPerPage;
    }

    const result = this.prisma.card.findMany({
      where: {
        deckId,
        showDataTime: {
          lt: new Date(),
        },
      },
      skip: skip,
      take: take,
      orderBy: {
        showDataTime: 'desc',
      },
    });
    return result;
  }

  async getCardById(id: string) {
    return await this.prisma.card.findUnique({
      where: {
        id,
      },
    });
  }

  async createCard({
    answer,
    title,
    deckId,
    showDataTime,
    type,
    evaluation,
    times,
    id
  }: CreateCardInput) {
    const result = await this.prisma.card.create({
      data: {
        answer,
        title,
        deckId,
        showDataTime,
        type,
        evaluation,
        times,
      },
    });

    return result;
  }

  async AnswerCard({ id, evaluation }: AnwerCardInput) {
    const cardExists = await this.prisma.card.findUnique({
      where: {
        id,
      },
    });
    if (cardExists) {
      if (cardExists.evaluation == evaluation) {
        cardExists.times += 1;
      } else {
        cardExists.times = 1;
        cardExists.evaluation = evaluation;
      }

      cardExists.showDataTime = this.addSecondssDayjs.execute(
        evalStrategy(cardExists.times, cardExists.evaluation)[evaluation],
      );

      await this.prisma.card.update({
        where: { id },
        data: cardExists,
      });
    }
  }

  async removeCardById(id: string) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    await this.prisma.card.delete({
      where: { id: id },
    });
    return card;
  }

  async editCard({ title, id, answer, deckId, evaluation, showDataTime, times, type }: EditCardInput) {
    return this.prisma.card.update({
      where: { id: id },
      data: {
        title,
        answer,
        deckId,
        evaluation,
        showDataTime,
        times,
        type
      },
    });
  }
}
