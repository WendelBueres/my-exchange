import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient, User } from '@prisma/client';
import { AppError } from 'src/errors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  prisma = new PrismaClient();

  async create(createUserDto: CreateUserDto) {
    if (
      createUserDto.role !== undefined &&
      createUserDto.role !== 'ADMIN' &&
      createUserDto.role !== 'USER'
    ) {
      throw new AppError('parameter role is invalid', 400);
    }

    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new AppError('email already exists', 400);
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    if (createUserDto.role === 'ADMIN') {
      const countAdmins = await this.prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (countAdmins > 0) {
        throw new AppError('only an admin can create a new admin', 401);
      }
    }

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    delete user.password;
    delete user.role;

    return user;
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new AppError('email already exists', 400);
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    delete user.password;

    return user;
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, reqUser: User) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!userExists) {
      throw new AppError('user not found', 404);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });

    delete user.password;

    if (user.role === 'USER' && userExists.role === 'USER') {
      delete user.role;
    }

    return user;
  }

  async remove(id: string) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!userExists) {
      throw new AppError('user not found', 404);
    }

    return await this.prisma.user.delete({
      where: { id: id },
    });
  }
}
