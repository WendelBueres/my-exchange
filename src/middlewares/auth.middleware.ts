import { AppError } from '../errors';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { Request, NextFunction, Response } from 'express';

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const jwtService = new JwtService();
  const prisma = new PrismaClient();

  if (!req.headers.authorization) {
    throw new AppError('Unauthorized', 401);
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    await jwtService.verifyAsync(token, {
      secret: process.env.SECRET_KEY,
    });
  } catch (error) {
    throw new AppError('Unauthorized', 403);
  }

  try {
    const session = await prisma.session.findUnique({
      where: {
        token: token,
      },
    });

    if (session.dead) {
      throw new AppError('Unauthorized', 403);
    }
  } catch (error) {
    throw new AppError('Unauthorized', 403);
  }

  const userId = jwtService.decode(token)['id'];

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  req.user = user;

  return next();
}
