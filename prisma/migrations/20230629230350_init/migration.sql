/*
  Warnings:

  - Changed the type of `iso4217` on the `Currency` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Currency" DROP COLUMN "iso4217",
ADD COLUMN     "iso4217" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Currency_iso4217_key" ON "Currency"("iso4217");
