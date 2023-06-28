import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { Headers } from '@nestjs/common';
import { Request } from 'express';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  signIn(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.singIn(createLoginDto);
  }

  @Get('/verify')
  @HttpCode(200)
  check(@Req() req: Request) {
    return this.loginService.check(req);
  }

  @Delete('/killer')
  @HttpCode(204)
  async delete(@Headers() headers) {
    const token = headers.authorization.split(' ')[1];

    return this.loginService.delete(token);
  }
}
