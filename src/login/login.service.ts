import { Injectable, Req } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import checkUser from 'src/utils/checkUserExists.utils';
import checkPassword from 'src/utils/checkPassword.util';
import { Request } from 'express';
import { AppError } from 'src/errors';

@Injectable()
export class LoginService {
  prisma = new PrismaClient();

  async singIn(createLoginDto: CreateLoginDto) {
    const user = await checkUser(createLoginDto);
    await checkPassword(user, createLoginDto.password);

    const jwtService = new JwtService();

    const payload = { id: user.id, username: user.name };

    let time = '8h';

    if (createLoginDto.remember_me) {
      time = '3y';
    }

    const token = await jwtService.signAsync(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: time,
    });

    await this.prisma.session.create({
      data: { token: token },
    });

    return {
      access_token: token,
    };
  }

  async check(req: Request) {
    const token = req.headers.authorization.split(' ')[1];

    const session = await this.prisma.session.findUnique({
      where: { token: token },
    });

    if (session.dead) {
      throw new AppError('Token is dead', 403);
    }

    return {
      statusCode: 200,
      message: 'Token alive',
    };
  }

  async delete(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { token: token },
    });

    if (session.dead) {
      throw new AppError('This token is already dead');
    }

    await this.prisma.session.update({
      where: { token: token },
      data: { dead: true },
    });
  }
}
