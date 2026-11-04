-- Payment choice at checkout (cash on delivery or Fonepay QR), the proof the
-- customer sends for a QR payment, and the customer's email for updates.
-- Safe to run against an existing database: existing orders become COD.

-- CreateEnum
CREATE TYPE "OrderPaymentMethod" AS ENUM ('COD', 'FONEPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "Order"
  ADD COLUMN "email" TEXT,
  ADD COLUMN "paymentMethod" "OrderPaymentMethod" NOT NULL DEFAULT 'COD',
  ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
  ADD COLUMN "paymentRef" TEXT,
  ADD COLUMN "paymentProof" TEXT,
  ADD COLUMN "paymentVerifiedAt" TIMESTAMP(3),
  ADD COLUMN "paymentVerifiedBy" TEXT;
