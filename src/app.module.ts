import { Module } from '@nestjs/common';
import { HttpModule } from './infra/presentation/http/http.module';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule { }