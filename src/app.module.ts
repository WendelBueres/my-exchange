import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { RegistersModule } from './registers/registers.module';
import { WalletsModule } from './wallets/wallets.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [LoginModule, UsersModule, RegistersModule, WalletsModule, CurrencyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
