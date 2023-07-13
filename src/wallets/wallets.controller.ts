import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Request } from 'express';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto, @Req() req: Request) {
    return this.walletsService.create(createWalletDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.walletsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletsService.remove(id);
  }
}
