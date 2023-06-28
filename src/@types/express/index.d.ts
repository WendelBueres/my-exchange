import { NestApplication } from "@nestjs/core";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        role: EnumRoles;
      };
    }
  }
}
