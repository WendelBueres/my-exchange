import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

enum EnumTypeRegister {
    'PURCHASE' = 'PURCHASE',
    'SALE' = 'SALE'
}

export class CreateRegisterDto {
    @IsOptional()
    @IsNumber()
    valueBase: number;

    @IsOptional()
    @IsNumber()
    valueCurrent: number;


    @IsEnum(EnumTypeRegister)
    type: EnumTypeRegister;

    @IsString()
    walletId: string;


}
