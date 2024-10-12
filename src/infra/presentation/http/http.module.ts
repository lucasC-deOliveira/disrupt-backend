import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { DeckResolver } from './graphql/resolvers/deck/deck.resolver';
import { DeckService } from 'src/infra/services/deck.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CardService } from 'src/infra/services/card.service';
import { CardResolver } from './graphql/resolvers/card/card.resolver';
import { AddSecondssDayjs } from 'src/infra/utils/AddSecondsDayjs/AddSecondsDayjs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    DatabaseModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    // Resolvers
    DeckResolver,
    CardResolver,
    AddSecondssDayjs,
    // Services
    DeckService,
    CardService,
  ],
})
export class HttpModule {}
