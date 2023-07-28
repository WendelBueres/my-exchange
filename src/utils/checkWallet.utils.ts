import { User } from '@prisma/client';
import { AppError } from 'src/errors';

export default function checkWallet(wallet: any, user: User) {
  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  if (wallet.userId !== user.id) {
    throw new AppError('Wallet not found', 404);
  }
}
