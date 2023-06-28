import { Request } from 'express';
import { AppError } from 'src/errors';

export function checkBodyRequest(req: Request) {
  if (!req.body.role || req.body.password || req.body.email || req.body.name) {
    throw new AppError(
      'Only the profile owner can update data other than the role',
      400,
    );
  }
}
