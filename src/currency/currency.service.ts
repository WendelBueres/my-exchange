import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaClient, User } from '@prisma/client';
import { AppError } from 'src/errors';

@Injectable()
export class CurrencyService {
  prisma = new PrismaClient();

  async create(createCurrencyDto: CreateCurrencyDto) {
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
