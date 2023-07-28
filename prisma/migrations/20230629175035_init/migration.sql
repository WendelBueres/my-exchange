/*
  Warnings:

  - You are about to drop the column `walletId` on the `Currency` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Currency" DROP CONSTRAINT "Currency_walletId_fkey";

-- AlterTable
ALTER TABLE "Currency" DROP COLUMN "walletId";

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_currency_fkey" FOREIGN KEY ("currency") REFERENCES "Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
