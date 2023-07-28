import { Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { EnumTypeRegister, PrismaClient, User } from '@prisma/client';
import { AppError } from 'src/errors';
import defineValueDay from 'src/utils/defineValueDay.utils';
import checkWallet from 'src/utils/checkWallet.utils';
import refreshValuesWallet from 'src/utils/refreshValuesWallet.utils';

@Injectable()
export class RegistersService {
  prisma = new PrismaClient();

  async create(createRegisterDto: CreateRegisterDto, user: User) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { id: createRegisterDto.walletId },
    });

    checkWallet(wallet, user);
    wallet = await refreshValuesWallet(wallet);

    const currency = await this.prisma.currency.findUnique({
      where: { id: wallet.currencyId },
    });

    if (!createRegisterDto.valueBase && !createRegisterDto.valueCurrent) {
      throw new AppError('Value base or value current is required');
    }

    if (createRegisterDto.valueBase && createRegisterDto.valueCurrent) {
      throw new AppError('Value base or value current is required, not both');
    }

    let currencyResponse: number = await defineValueDay(
      createRegisterDto,
      currency,
    );

    const register = await this.prisma.register.create({
      data: {
        type: createRegisterDto.type,
        valueBase: createRegisterDto.valueBase,
        valueCurrent: createRegisterDto.valueCurrent,
        purchaseExchange: currencyResponse,
        Wallet: {
          connect: { id: createRegisterDto.walletId },
        },
      },
    });

    if (createRegisterDto.type === EnumTypeRegister.PURCHASE) {
      const value = (wallet.value + register.valueCurrent).toFixed(2);
      const valueBase = (wallet.valueBase + register.valueBase).toFixed(2);
      await this.prisma.wallet.update({
        where: { id: createRegisterDto.walletId },
        data: {
          value: parseFloat(value),
          valueBase: parseFloat(valueBase),
        },
      });
    }

    if (createRegisterDto.type === EnumTypeRegister.SALE) {
      const value = (wallet.value - register.valueCurrent).toFixed(2);
      const valueBase = (wallet.valueBase - register.valueBase).toFixed(2);

      if (parseFloat(value) < 0 || parseFloat(valueBase) < 0) {
        await this.prisma.register.delete({
          where: { id: register.id },
        });

        throw new AppError('Insufficient funds');
      }

      await this.prisma.wallet.update({
        where: { id: createRegisterDto.walletId },
        data: {
          value: parseFloat(value),
          valueBase: parseFloat(valueBase),
        },
      });
    }

    return register;
  }

  async remove(id: string, user: User) {
    const register = await this.prisma.register.findUnique({
      where: { id: id },
    });

    let wallet = await this.prisma.wallet.findUnique({
      where: { id: register.walletId },
    });

    checkWallet(wallet, user);
    wallet = await refreshValuesWallet(wallet);

    if (register.type === EnumTypeRegister.PURCHASE) {
      const value = (wallet.value - register.valueCurrent).toFixed(2);
      const valueBase = (wallet.valueBase - register.valueBase).toFixed(2);

      await this.prisma.wallet.update({
        where: { id: register.walletId },
        data: {
          value: parseFloat(value),
          valueBase: parseFloat(valueBase),
        },
      });
    }
    if (register.type === EnumTypeRegister.SALE) {
      const value = (wallet.value + register.valueCurrent).toFixed(2);
      const valueBase = (wallet.valueBase + register.valueBase).toFixed(2);

      await this.prisma.wallet.update({
        where: { id: register.walletId },
        data: {
          value: parseFloat(value),
          valueBase: parseFloat(valueBase),
        },
      });
    }

    return await this.prisma.register.delete({
      where: { id: id },
    });
  }
}
