import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import isOwnerOrAdminMiddleware from 'src/middlewares/isOwnerOrAdmin.middleware';
import isOwnerMiddleware from 'src/middlewares/isOwner.middleware';
import authMiddleware from 'src/middlewares/auth.middleware';
import isAdminMiddleware from 'src/middlewares/isAdmin.middleware';
import hasPermissionForUpdate from 'src/middlewares/hasPermissionForUpdate.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware, isAdminMiddleware).forRoutes({
      path: 'users/admin',
      method: RequestMethod.POST,
    }),
      consumer.apply(authMiddleware, isOwnerOrAdminMiddleware).forRoutes({
        path: 'users',
        method: RequestMethod.DELETE,
      }),
      consumer.apply(authMiddleware, isOwnerOrAdminMiddleware).forRoutes({
        path: 'users/:id',
        method: RequestMethod.DELETE,
      }),
      consumer.apply(authMiddleware, hasPermissionForUpdate).forRoutes({
        path: 'users',
        method: RequestMethod.PATCH,
      }),
      consumer.apply(authMiddleware, hasPermissionForUpdate).forRoutes({
        path: 'users/:id',
        method: RequestMethod.PATCH,
      }),
      consumer.apply(authMiddleware, isOwnerMiddleware).forRoutes({
        path: 'users/:id',
        method: RequestMethod.GET,
      });
  }
}
