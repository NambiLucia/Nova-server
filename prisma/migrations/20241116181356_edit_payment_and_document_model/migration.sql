/*
  Warnings:

  - A unique constraint covering the columns `[voucherNo]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "filetype" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_voucherNo_key" ON "Payment"("voucherNo");
