import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request as IRequest, Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Post('admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  async updateUserCurrent(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    console.log(req.user);

    return this.usersService.update(req.user.id, updateUserDto, req.user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @HttpCode(204)
  @Delete()
  async removeUserCurrent(@Req() req: Request) {
    return this.usersService.remove(req.user.id);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    return this.usersService.remove(id);
  }
}
