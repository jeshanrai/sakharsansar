-- Add B2B clients (wholesale/retail shops we supply → admin panel)
-- Safe to run against an existing database.

-- CreateEnum
CREATE TYPE "B2BType" AS ENUM ('RETAILER', 'WHOLESALER', 'DISTRIBUTOR', 'CAFE_RESTAURANT', 'SUPERMARKET', 'OTHER');

-- CreateTable
CREATE TABLE "B2BClient" (
    "id" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "phone" TEXT NOT NULL,
    "altPhone" TEXT,
    "email" TEXT,
    "type" "B2BType" NOT NULL DEFAULT 'RETAILER',
    "address" TEXT NOT NULL,
    "mapUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "B2BClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "B2BClient_type_idx" ON "B2BClient"("type");

-- CreateIndex
CREATE INDEX "B2BClient_createdAt_idx" ON "B2BClient"("createdAt");

-- AddForeignKey
ALTER TABLE "B2BClient" ADD CONSTRAINT "B2BClient_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "B2BClient" ADD CONSTRAINT "B2BClient_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "B2BClient" ADD CONSTRAINT "B2BClient_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
