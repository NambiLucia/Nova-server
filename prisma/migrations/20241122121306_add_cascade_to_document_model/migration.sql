-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_paymentId_fkey";

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
