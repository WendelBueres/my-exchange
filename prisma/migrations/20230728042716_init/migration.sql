-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "lastUpdateExchange" DROP DEFAULT;
