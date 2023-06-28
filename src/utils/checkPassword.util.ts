import { User } from '@prisma/client';
import * as bcript from 'bcrypt';
import { AppError } from 'src/errors';

export default async function checkPassword(user: User, password: string) {
  const isMatch = await bcript.compare(password, user.password);

  if (!isMatch) {
    throw new AppError('email and/or password invalid', 403);
  }
}
