import { PrismaClient } from '@prisma/client';
import { AppError } from '../errors';
import { Request, NextFunction, Response } from 'express';

export default async function isAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const prisma = new PrismaClient();

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new AppError('Unauthorized', 403);
  }

  if (user.role !== 'ADMIN') {
    throw new AppError('User not authorized', 401);
  }

  return next();
}
