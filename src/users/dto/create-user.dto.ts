import { EnumRoles } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  readonly id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  role: EnumRoles;

  readonly created_at: Date;
  readonly updated_at: Date;
}

