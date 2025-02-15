import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Card } from '../../models/card/card';
import { CardService } from 'src/infra/services/card.service';
import { CreateCardInput } from '../../inputs/card/CreateCardInput';
import { AnwerCardInput } from '../../inputs/card/AnwerCardInput';
import { EditCardInput } from '../../inputs/card/EditCardInput';
import { RedisService } from 'src/infra/services/redis.service';
import { BlobStorageService } from 'src/infra/services/blobStorage.service';

@Resolver(() => Card)
export class CardResolver {
  constructor(
    private cardsService: CardService,
    private redisService: RedisService,
    private blobStorageService: BlobStorageService,
  ) { }
  @Query(() => [Card])
  async getAllCardsByDeckid(
    @Args('id') id: string,
    @Args('itemsPerPage', { type: () => String, nullable: true })
    itemsPerPage?: string,
    @Args('page', { type: () => String, nullable: true }) page?: string,
  ) {
    const hasCache = await this.redisService.get('getAllCardsByDeckid' + id);
    if (!hasCache) {
      const result = await this.cardsService.getAllCardByDeckId(
        id,
        Number(itemsPerPage),
        Number(page),
      );
      await this.redisService.set('getAllCardsByDeckid' + id, result);
      return result;
    }
    return hasCache;
  }
  @Mutation(() => Card)
  async createCard(@Args('data') {
    answer,
    photo,
    video,
    title,
    deckId,
    showDataTime,
    evaluation,
    times,
    type,
  }: CreateCardInput) {
    const result = await this.cardsService.createCard({
      answer,
      title,
      deckId,
      showDataTime,
      evaluation,
      times,
      type,
    });

    if (result.type == 'image' || result.type == 'video') {
      await this.blobStorageService.uploadFile(`${result.type}/${result.id}`, Buffer.from(result.type == 'image' ? photo : video));
    }

    return { ...result, photo, video };
  }

  @Mutation(() => Card)
  async editCard(@Args('data') {
    answer,
    photo,
    video,
    title,
    id,
  }: EditCardInput) {
    const result = await this.cardsService.editCard({
      answer,
      title,
      id
    });
    await this.redisService.del('getCardById' + id);
    await this.redisService.del('getAllCardsByDeckid' + result.deckId);
    if (result.type == 'image' || result.type == 'video') {
      await this.blobStorageService.deleteFile(`${result.type}/${result.id}`)
    }
    if (result.type == 'image' || result.type == 'video') {
      await this.blobStorageService.uploadFile(`${result.type}/${result.id}`, Buffer.from(result.type == 'image' ? photo : video));
    }
    return result;
  }

  @Query(() => Card)
  async getCardById(@Args('id') id: string) {
    const hasCache = await this.redisService.get('getCardById' + id);
    if (!hasCache) {
      const deck = await this.cardsService.getCardById(id);
      await this.redisService.set('getCardById' + id, deck);
      return deck;
    }
    return hasCache;
  }

  @Mutation(() => Card)
  async answerCard(@Args('data') data: AnwerCardInput) {
    await this.cardsService.AnswerCard(data);
    await this.redisService.del('getCardById' + data.id);
    const card = await this.cardsService.getCardById(data.id);
    await this.redisService.del('getAllCardsByDeckid' + card.deckId);
    return card;

  }
  @Mutation(() => Card)
  async removeCard(@Args('id') id: string) {
    const result = await this.cardsService.removeCardById(id);
    await this.redisService.del('getAllCardsByDeckid' + result.deckId);
    await this.redisService.del('getCardById' + id);
    if (result.type == 'image' || result.type == 'video') {
      await this.blobStorageService.deleteFile(`${result.type}/${result.id}`)
    }
    return result;
  }
}
