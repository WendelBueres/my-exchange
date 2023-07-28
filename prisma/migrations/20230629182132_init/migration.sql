/*
  Warnings:

  - You are about to alter the column `iso4217` on the `Currency` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3)`.

*/
-- AlterTable
ALTER TABLE "Currency" ALTER COLUMN "iso4217" SET DATA TYPE VARCHAR(3);
