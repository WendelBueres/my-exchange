import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RegistersService } from './registers.service';
import { RegistersController } from './registers.controller';
import authMiddleware from 'src/middlewares/auth.middleware';

@Module({
  controllers: [RegistersController],
  providers: [RegistersService],
})
export class RegistersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes(RegistersController);
  }
}
