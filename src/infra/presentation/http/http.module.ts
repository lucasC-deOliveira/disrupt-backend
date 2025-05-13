import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { DeckResolver } from './graphql/resolvers/deck/deck.resolver';
import { DeckService } from 'src/infra/services/deck.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CardService } from 'src/infra/services/card.service';
import { CardResolver } from './graphql/resolvers/card/card.resolver';
import { AddSecondssDayjs } from 'src/infra/utils/AddSecondsDayjs/AddSecondsDayjs';
import { SyncModule } from './rest/sync/sync.module';
import { RedisService } from 'src/infra/services/redis.service';
import { MediaModule } from './rest/media/media.module';
import { BlobStorageService } from 'src/infra/services/blobStorage.service';
import { LocalStorageProvider } from 'src/infra/services/localStorageProvider.service';
import { MongoStorageProvider } from 'src/infra/services/MongoStorageProvider.service';
import { VideoCutterModule } from './rest/videoCutter/videoCutter.module';
import { EncryptionService } from 'src/infra/services/encryption.service';
import { SyncService } from 'src/infra/services/sync.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    DatabaseModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    SyncModule,
    MediaModule,
    VideoCutterModule
  ],
  providers: [
    // Resolvers
    DeckResolver,
    CardResolver,
    AddSecondssDayjs,
    // Services
    DeckService,
    CardService,
    RedisService,
    BlobStorageService,
    LocalStorageProvider,
    MongoStorageProvider,
    ConfigService,
    EncryptionService,
    SyncService
    // Utils
  ],
})
export class HttpModule { }
