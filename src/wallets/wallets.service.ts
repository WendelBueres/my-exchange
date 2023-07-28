import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { AppError } from 'src/errors';
import refreshValuesWallet from 'src/utils/refreshValuesWallet.utils';
import api from 'src/services/api';
import checkWallet from 'src/utils/checkWallet.utils';

@Injectable()
export class WalletsService {
  prisma = new PrismaClient();

  async create(createWalletDto: CreateWalletDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found');
    }

    if (createWalletDto.currency || createWalletDto.iso4217) {
      let currency = null;

      //Com tratamento de erro utilizando try/catch e instanceof Prisma.PrismaClientKnownRequestError
      if (createWalletDto.currency) {
        try {
          currency = await this.prisma.currency.findUniqueOrThrow({
            where: {
              name: createWalletDto.currency,
            },
          });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
              throw new AppError('Currency not found', 404);
            }
          }
        }
      }

      //Tratamento de erro utilizando try/catch e instanceof Prisma.PrismaClientKnownRequestError
      if (createWalletDto.iso4217) {
        createWalletDto.iso4217 = createWalletDto.iso4217.toUpperCase();

        try {
          currency = await this.prisma.currency.findUniqueOrThrow({
            where: {
              iso4217: createWalletDto.iso4217,
            },
          });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
              throw new AppError('Currency not found', 404);
            }
          }
        }
      }

      const walletExists = await this.prisma.wallet.count({
        where: {
          userId: userId,
          currency: {
            equals: currency.name,
            mode: 'insensitive',
          },
        },
      });

      if (walletExists > 0) {
        throw new AppError('Wallet already exists', 400);
      }

      let consult = `${currency.iso4217}-BRL`;
      const responseApi = await api.get(`/${consult}`);
      consult = consult.replace('-', '');

      const value = responseApi.data[consult].bid;

      const wallet = await this.prisma.wallet.create({
        data: {
          currency: currency.name,
          value: createWalletDto.value,
          valueBase: createWalletDto.valueBase,
          exchangeOfDay: parseFloat(value),
          lastUpdateExchange: new Date(Date.now()),
          User: {
            connect: {
              id: userId,
            },
          },
          Currency: {
            connect: {
              id: currency.id,
            },
          },
        },
      });

      return wallet;
    }

    throw new AppError('Currency or iso4217 is required');
  }

  async findAll(userId: string) {
    try {
      const wallets = await this.prisma.wallet.findMany({
        where: { userId: userId },
      });

      const refreshWallets = [];

      wallets.forEach(async (wallet) => {
        const walletRefresh = await refreshValuesWallet(wallet);

        refreshWallets.push(walletRefresh);
      });
    } catch (error) {
      throw new AppError('Error to refresh wallets', 500);
    } finally {
      const wallets = await this.prisma.wallet.findMany({
        where: { userId: userId },
      });

      return wallets.sort((a, b) => {
        if (a.currency > b.currency) {
          return 1;
        }
        if (a.currency < b.currency) {
          return -1;
        }
        return 0;
      });
    }
  }

  async findOne(id: string, user: User) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { id: id },
    });

    checkWallet(wallet, user);
    await refreshValuesWallet(wallet);

    return await this.prisma.wallet.findUnique({
      where: { id: id },
      include: {
        Extract: true,
      },
    });
  }

  //Tratamento de erro manual, utilizando condicional if
  async remove(id: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: id },
    });

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    return await this.prisma.wallet.delete({
      where: { id: id },
    });
  }
}
