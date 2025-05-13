import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Card } from '../../models/card/card';
import { CardService } from 'src/infra/services/card.service';
import { CreateCardInput } from '../../inputs/card/CreateCardInput';
import { AnwerCardInput } from '../../inputs/card/AnwerCardInput';
import { EditCardInput } from '../../inputs/card/EditCardInput';
import { RedisService } from 'src/infra/services/redis.service';
import { BlobStorageService } from 'src/infra/services/blobStorage.service';
import { EncryptionService } from 'src/infra/services/encryption.service';

@Resolver(() => Card)
export class CardResolver {
  constructor(
    private cardsService: CardService,
    private redisService: RedisService,
    private blobStorageService: BlobStorageService,
    private readonly encryptionService: EncryptionService,

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
      )

      const cards = result.map(card => {
        const title = this.encryptionService.decrypt(Buffer.from(card.title, "base64")).toString("utf-8")
        const answer = this.encryptionService.decrypt(Buffer.from(card.answer, "base64")).toString("utf-8")
        card.title = title
        card.answer = answer
        return card
      });

      await this.redisService.set('getAllCardsByDeckid' + id, cards);
      return cards;
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

    const encryptedTitle = this.encryptionService.encrypt(Buffer.from(title)).toString("base64")
    const encryptedAnswer = this.encryptionService.encrypt(Buffer.from(answer)).toString("base64")
    const result = await this.cardsService.createCard({
      answer: encryptedAnswer,
      title: encryptedTitle,
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
    const encryptedTitle = this.encryptionService.encrypt(Buffer.from(title)).toString("base64")
    const encryptedAnswer = this.encryptionService.encrypt(Buffer.from(answer)).toString("base64")
    const result = await this.cardsService.editCard({
      answer: encryptedAnswer,
      title: encryptedTitle,
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
      const card = await this.cardsService.getCardById(id);
      const title = this.encryptionService.decrypt(Buffer.from(card.title, "base64")).toString("utf-8")
      const answer = this.encryptionService.decrypt(Buffer.from(card.answer, "base64")).toString("utf-8")
      card.title = title
      card.answer = answer

      await this.redisService.set('getCardById' + id, card);
      return card;
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
