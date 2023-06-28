import { EnumRoles } from '@prisma/client';
import { AppError } from 'src/errors';

export function formatRole(role: string) {
  if (role) {
    role = role.toUpperCase();

    if (!(role in EnumRoles)) {
      throw new AppError('role parameter invalid', 400);
    }
  }

  return role;
}
