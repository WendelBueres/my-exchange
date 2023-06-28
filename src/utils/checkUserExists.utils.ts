import { PrismaClient, User } from '@prisma/client';
import { AppError } from 'src/errors';

interface IUserLogin {
  email: string;
  password: string;
}

export default async function checkUserExist(createLoginDto: IUserLogin) {
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { email: createLoginDto.email },
    });

    return user;
  } catch (error) {
    throw new AppError('email and/or password invalid', 403);
  }
}
