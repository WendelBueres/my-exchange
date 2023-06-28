import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import isAdminMiddleware from 'src/middlewares/isAdmin.middleware';
import authMiddleware from 'src/middlewares/auth.middleware';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware, isAdminMiddleware).forRoutes({
      path: 'currency',
      method: RequestMethod.POST,
    });
    consumer.apply(authMiddleware, isAdminMiddleware).forRoutes({
      path: 'currency/:id',
      method: RequestMethod.ALL,
    });
  }
}
