-- Link an order to the sale it was moved to (null until moved).
ALTER TABLE "Order" ADD COLUMN "saleId" TEXT;
CREATE UNIQUE INDEX "Order_saleId_key" ON "Order"("saleId");
