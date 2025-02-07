import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
  });
  const port = 3333;
  app.use(json({ limit: '500mb' }));
  await app.listen(port);
  Logger.log('App running on ' + port);
}
bootstrap();
