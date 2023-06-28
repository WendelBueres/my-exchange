-- DropForeignKey
ALTER TABLE "Currency" DROP CONSTRAINT "Currency_walletId_fkey";

-- AlterTable
ALTER TABLE "Currency" ALTER COLUMN "walletId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
