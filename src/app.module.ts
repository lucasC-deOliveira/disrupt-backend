import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { HttpModule } from './infra/presentation/http/http.module';
import { WebsocketsModule } from './infra/presentation/websockets/websockets.module';

@Module({
  imports: [HttpModule, WebsocketsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
