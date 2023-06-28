import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { handleErrorMiddleware } from './middlewares/handleError.middleware';
import 'express-async-errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(handleErrorMiddleware);

  await app.listen(3001);
}
bootstrap();
