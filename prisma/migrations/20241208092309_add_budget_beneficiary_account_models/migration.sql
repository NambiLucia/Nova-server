/*
  Warnings:

  - You are about to drop the column `accountCode` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `beneficiaryCode` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `budgetCode` on the `Payment` table. All the data in the column will be lost.
  - Made the column `filetype` on table `Document` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `accountId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beneficiaryId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "filetype" SET NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "accountCode",
DROP COLUMN "beneficiaryCode",
DROP COLUMN "budgetCode",
ADD COLUMN     "accountId" TEXT NOT NULL,
ADD COLUMN     "beneficiaryId" TEXT NOT NULL,
ADD COLUMN     "budgetId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
