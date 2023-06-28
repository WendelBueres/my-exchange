import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateWalletDto {
  readonly value: number;
  readonly valueBase: number;

  @IsOptional()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  iso4217: string;
}
