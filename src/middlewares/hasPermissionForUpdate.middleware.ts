import { PrismaClient } from '@prisma/client';
import { AppError } from '../errors';
import { Request, NextFunction, Response } from 'express';
import { formatRole } from 'src/utils/formatRole.utils';
import { checkBodyRequest } from 'src/utils/checkBodyRequest.utils';
import { countAdmins } from 'src/utils/countAdmins.utils';

export default async function hasPermissionForUpdate(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma = new PrismaClient(),
) {
  req.body.role = formatRole(req.body.role);

  if (req.user.role === 'ADMIN') {
    if (req.params.id === req.user.id || !req.params.id) {
      if (req.body.role) {
        await countAdmins(req);
      }

      return next();
    }
    checkBodyRequest(req);

    return next();
  }

  if (req.params.id === req.user.id || !req.params.id) {
    if (req.user.role !== 'ADMIN' && req.body.role) {
      throw new AppError('You cannot update your role', 403);
    }

    return next();
  }

  if (req.params.id !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You cannot update another user', 403);
  }
}
