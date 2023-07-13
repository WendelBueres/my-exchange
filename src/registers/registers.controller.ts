import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RegistersService } from './registers.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { Request } from 'express';

@Controller('registers')
export class RegistersController {
  constructor(private readonly registersService: RegistersService) {}

  @Post()
  create(@Body() createRegisterDto: CreateRegisterDto, @Req() req: Request) {
    return this.registersService.create(createRegisterDto, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegisterDto: UpdateRegisterDto, @Req() req: Request) {
    return this.registersService.update(id, updateRegisterDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.registersService.remove(id, req.user);
  }
}
