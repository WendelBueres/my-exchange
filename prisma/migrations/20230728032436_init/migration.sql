/*
  Warnings:

  - Added the required column `lastUpdateExchange` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "lastUpdateExchange" TIMESTAMP(3) NOT NULL;
