import * as bcrypt from 'bcrypt';

interface ICreateUserDto {
  name: string;
  email: string;
  password: string;
}

export default async function hashPassword(createUserDto) {
  const passwordHash = await bcrypt.hash(createUserDto.password, 10);

  createUserDto.password = passwordHash;

  return createUserDto;
}
