import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { AppError } from 'src/errors';

export async function countAdmins(req: Request) {
  const prisma = new PrismaClient();

  const admins = await prisma.user.count({
    where: {
      role: 'ADMIN',
    },
  });

  if (admins === 1 && req.body.role !== 'ADMIN') {
    throw new AppError('You cannot delete the last admin', 403);
  }
}
