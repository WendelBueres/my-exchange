import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaClient } from '@prisma/client';
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

    if (!createWalletDto.currency && !createWalletDto.iso4217) {
      throw new AppError('Currency or iso4217 is required');
    }

    let currency = null;

    if (createWalletDto.currency) {
      currency = await this.prisma.currency.findFirst({
        where: {
          name: createWalletDto.currency,
        },
      });
    }

    if (createWalletDto.iso4217) {
      currency = await this.prisma.currency.findFirst({
        where: {
          iso4217: createWalletDto.iso4217,
        },
      });
    }

    return await this.prisma.wallet.create({
      data: {
        currency: createWalletDto.currency,
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

  async findAll(userId: string) {
    return await this.prisma.wallet.findMany({
      where: { userId: userId },
    });
  }

  async findOne(id: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: id },
    });

    if (!wallet) {
      throw new AppError('Wallet not found');
    }

    return wallet;
  }

  async findRegisters(id: string) {
    return await this.prisma.register.findMany({
      where: { walletId: id },
    });
  }

  async update(id: string, updateWalletDto: UpdateWalletDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: id },
    });

    if (!wallet) {
      throw new AppError('Wallet not found');
    }

    return await this.prisma.wallet.update({
      where: { id: id },
      data: updateWalletDto,
    });
  }

  async remove(id: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: id },
    });

    if (!wallet) {
      throw new AppError('Wallet not found');
    }

    return await this.prisma.wallet.delete({
      where: { id: id },
    });
  }
}
