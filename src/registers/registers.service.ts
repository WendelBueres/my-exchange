import { Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { PrismaClient, User } from '@prisma/client';
import { AppError } from 'src/errors';
import api from 'src/services/api';

@Injectable()
export class RegistersService {
  prisma = new PrismaClient();

  async create(createRegisterDto: CreateRegisterDto, user: User) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: createRegisterDto.walletId },
    });

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    if (wallet.userId !== user.id) {
      throw new AppError('Wallet not found', 404);
    }

    const currency = await this.prisma.currency.findUnique({
      where: { id: wallet.currencyId },
    });

    let currencyResponse = null;

    if (!createRegisterDto.valueBase && !createRegisterDto.valueCurrent) {
      throw new AppError('Value base or value current is required');
    }

    if (createRegisterDto.valueBase && createRegisterDto.valueCurrent) {
      throw new AppError('Value base or value current is required, not both');
    }

    if (createRegisterDto.valueCurrent) {
      let consult = `${currency.iso4217}-BRL`;
      await api
        .get(consult)
        .then((response) => (currencyResponse = response.data))
        .catch((error) => {
          throw new AppError(error.message, error.statusCode);
        });
      consult = consult.replace('-', '');
      currencyResponse = parseFloat(currencyResponse[consult].bid).toFixed(4);
      currencyResponse = parseFloat(currencyResponse);

      createRegisterDto.valueBase =
        createRegisterDto.valueCurrent * currencyResponse;
    } else {
      async function defineValueDay() {
        let consult = `BRL-${currency.iso4217}`;
        await api
          .get(consult)
          .then((response) => (currencyResponse = response.data))
          .catch((error) => {
            console.log(error.message, error.statusCode);
          });
        consult = consult.replace('-', '');
        currencyResponse = parseFloat(currencyResponse[consult].bid);
        currencyResponse = currencyResponse.toFixed(4);
        currencyResponse = parseFloat(currencyResponse);

        createRegisterDto.valueCurrent =
          currencyResponse * createRegisterDto.valueBase;

        consult = `${currency.iso4217}-BRL`;
        await api
          .get(consult)
          .then((response) => (currencyResponse = response.data))
          .catch((error) => {
            console.log(error.message, error.statusCode);
          });
        consult = consult.replace('-', '');

        currencyResponse = parseFloat(currencyResponse[consult].bid).toFixed(4);

        return parseFloat(currencyResponse);
      }

      currencyResponse = await defineValueDay();
    }

    const register = await this.prisma.register.create({
      data: {
        type: createRegisterDto.type,
        valueBase: createRegisterDto.valueBase,
        valueCurrent: createRegisterDto.valueCurrent,
        valueDayPurchase: currencyResponse,
        Wallet: {
          connect: { id: createRegisterDto.walletId },
        },
      },
    });

    await this.prisma.wallet.update({
      where: { id: createRegisterDto.walletId },
      data: {
        value: wallet.value + register.valueCurrent,
        valueBase: wallet.valueBase + register.valueBase,
      },
    });

    return register;
  }

  async update(id: string, updateRegisterDto: UpdateRegisterDto, user: User) {
    //TODO: Fazer lógica para atualizar o valor da carteira, caso o valor do registro seja alterado.

    const register = await this.prisma.register.findUnique({
      where: { id: id },
    });

    await this.prisma.wallet.update({
      where: { id: register.walletId },
      data: {
        value: register.valueCurrent - register.valueDayPurchase,
        valueBase: register.valueBase - register.valueBase,
      },
    });

    await this.prisma.register.delete({
      where: { id: id },
    });

    const wallet = await this.prisma.wallet.findUnique({
      where: { id: register.walletId },
    });

    if (wallet.userId !== user.id) {
      throw new AppError('Register not found', 404);
    }

    return this.prisma.register.update({
      where: { id: id },
      data: updateRegisterDto,
    });
  }

  async remove(id: string, user: User) {
    //TODO: Fazer lógica para atualizar o valor da carteira, caso o valor do registro seja excluido.

    const register = await this.prisma.register.findUnique({
      where: { id: id },
    });

    const wallet = await this.prisma.wallet.findUnique({
      where: { id: register.walletId },
    });

    if (wallet.userId !== user.id) {
      throw new AppError('Register not found', 404);
    }

    return await this.prisma.register.delete({
      where: { id: id },
    });
  }
}
