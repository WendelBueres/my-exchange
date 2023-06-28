import { PrismaClient } from '@prisma/client';
import { AppError } from '../errors';
import { Request, NextFunction, Response } from 'express';
import { countAdmins } from 'src/utils/countAdmins.utils';

export default async function isOwnerOrAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.params.id) {
    if (req.user.role === 'ADMIN') {
      await countAdmins(req);
    }

    return next();
  }

  if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {
    throw new AppError(
      'This action is restrict as admin and owner of profile',
      403,
    );
  }

  if (req.user.id === req.params.id) {
    if (req.user.role === 'ADMIN') {
      await countAdmins(req);
    }

    return next();
  }

  if (req.user.role === 'ADMIN') {
    return next();
  }
}
