import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsBoolean()
  remember_me: boolean;
}
