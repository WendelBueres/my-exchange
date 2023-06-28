import { AppError } from '../errors';
import { Request, NextFunction, Response } from 'express';

export default async function isOwnerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user.id !== req.params.id) {
    throw new AppError('This action is restricted owner of profile', 401);
  }

  return next();
}
