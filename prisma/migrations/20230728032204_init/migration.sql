/*
  Warnings:

  - You are about to drop the column `valueDayPurchase` on the `Register` table. All the data in the column will be lost.
  - Added the required column `purchaseExchange` to the `Register` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Register" DROP COLUMN "valueDayPurchase",
ADD COLUMN     "purchaseExchange" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "exchangeOfDay" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "EnumCurrency";
