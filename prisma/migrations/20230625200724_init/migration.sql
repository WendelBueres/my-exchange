/*
  Warnings:

  - You are about to drop the column `valueOnDay` on the `Register` table. All the data in the column will be lost.
  - Added the required column `type` to the `Register` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueCurrent` to the `Register` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueDayPurchase` to the `Register` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EnumTypeRegister" AS ENUM ('PURCHASE', 'SALE');

-- AlterTable
ALTER TABLE "Register" DROP COLUMN "valueOnDay",
ADD COLUMN     "type" "EnumTypeRegister" NOT NULL,
ADD COLUMN     "valueCurrent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "valueDayPurchase" DOUBLE PRECISION NOT NULL;
