import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { AppError } from 'src/errors';

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

      return await this.prisma.wallet.create({
        data: {
          currency: currency.name,
          value: createWalletDto.value,
          valueBase: createWalletDto.valueBase,
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
    }

    throw new AppError('Currency or iso4217 is required');
  }

  async findAll(userId: string) {
    //TODO: Atualizar valores de moedas antes de retornar carteiras.

    return await this.prisma.wallet.findMany({
      where: { userId: userId },
    });
  }

  async findOne(id: string) {
    //TODO: Atualizar valores de moedas antes de retornar carteira.

    const wallet = await this.prisma.wallet.findUnique({
      where: { id: id },
      include: {
        Extract: true,
      },
    });

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    return wallet;
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
