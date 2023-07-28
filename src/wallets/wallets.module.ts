import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import authMiddleware from 'src/middlewares/auth.middleware';
import isOwnerMiddleware from 'src/middlewares/isOwner.middleware';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes({
      path: 'wallets',
      method: RequestMethod.POST,
    });
    consumer.apply(authMiddleware).forRoutes({
      path: 'wallets',
      method: RequestMethod.GET,
    });
    consumer.apply(authMiddleware).forRoutes({
      path: 'wallets/:id',
      method: RequestMethod.GET,
    });
    consumer.apply(authMiddleware).forRoutes({
      path: 'wallets/:id',
      method: RequestMethod.DELETE,
    });
  }
}
