import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaClient, User } from '@prisma/client';
import { AppError } from 'src/errors';

@Injectable()
export class CurrencyService {
  prisma = new PrismaClient();

  async create(createCurrencyDto: CreateCurrencyDto) {
    if (createCurrencyDto.iso4217) {
      createCurrencyDto.iso4217 = createCurrencyDto.iso4217.toUpperCase();

      const checkIfISO4217Exists = await this.prisma.currency.findFirst({
        where: {
          iso4217: { equals: createCurrencyDto.iso4217, mode: 'insensitive' },
        },
      });

      if (checkIfISO4217Exists) {
        throw new AppError('iso4217 already is registered', 400);
      }
    }

    if (createCurrencyDto.name) {
      const checkIfNameExists = await this.prisma.currency.findFirst({
        where: {
          name: { equals: createCurrencyDto.name, mode: 'insensitive' },
        },
      });

      if (checkIfNameExists) {
        throw new AppError('name already is registered', 400);
      }
    }

    return await this.prisma.currency.create({
      data: {
        name: createCurrencyDto.name,
        iso4217: createCurrencyDto.iso4217,
      },
    });
  }

  async findAll() {
    return await this.prisma.currency.findMany();
  }

  async update(id: string, updateCurrencyDto: UpdateCurrencyDto) {
    const currency = await this.prisma.currency.findUnique({
      where: { id: id },
    });

    if (!currency) {
      throw new AppError('Currency not found', 404);
    }

    const checkIfISO4217Exists = await this.prisma.currency.findFirst({
      where: {
        iso4217: { equals: updateCurrencyDto.iso4217, mode: 'insensitive' },
      },
    });

    if (updateCurrencyDto.iso4217) {
      updateCurrencyDto.iso4217 = updateCurrencyDto.iso4217.toUpperCase();

      if (
        checkIfISO4217Exists &&
        checkIfISO4217Exists.iso4217 !== currency.iso4217
      ) {
        throw new AppError('iso4217 already is registered', 400);
      }
    }

    if (updateCurrencyDto.name) {
      const checkIfNameExists = await this.prisma.currency.findFirst({
        where: {
          name: { equals: updateCurrencyDto.name, mode: 'insensitive' },
        },
      });

      if (checkIfNameExists && checkIfNameExists.name !== currency.name) {
        throw new AppError('name already is registered', 400);
      }
    }

    return await this.prisma.currency.update({
      where: { id: id },
      data: updateCurrencyDto,
    });
  }

  async remove(id: string) {
    const currency = await this.prisma.currency.findUnique({
      where: { id: id },
    });

    if (!currency) {
      throw new AppError('Currency not found', 404);
    }

    return await this.prisma.currency.delete({
      where: { id: id },
    });
  }
}
