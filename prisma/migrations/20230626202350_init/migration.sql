-- CreateEnum
CREATE TYPE "EnumRoles" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "EnumRoles" NOT NULL DEFAULT 'USER';
