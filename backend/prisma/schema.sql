-- SakharSansar Database Schema
-- Run: psql -U postgres -d sakharsansar -f schema.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create enum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- Admin table
CREATE TABLE "Admin" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email"     TEXT NOT NULL,
    "password"  TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- Order table
CREATE TABLE "Order" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "customer"  TEXT NOT NULL,
    "phone"     TEXT NOT NULL,
    "address"   TEXT NOT NULL,
    "product"   TEXT NOT NULL,
    "quantity"  INTEGER NOT NULL,
    "amount"    DOUBLE PRECISION NOT NULL,
    "status"    "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Expense table
CREATE TABLE "Expense" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title"       TEXT NOT NULL,
    "amount"      DOUBLE PRECISION NOT NULL,
    "category"    TEXT NOT NULL,
    "description" TEXT,
    "date"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- Enquiry enums
CREATE TYPE "EnquiryType" AS ENUM ('B2C', 'B2B', 'GIFTING', 'PARTNERSHIP', 'OTHER');
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');

-- Enquiry table (storefront contact form)
CREATE TABLE "Enquiry" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name"      TEXT NOT NULL,
    "contact"   TEXT NOT NULL,
    "type"      "EnquiryType" NOT NULL DEFAULT 'OTHER',
    "message"   TEXT NOT NULL,
    "status"    "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Enquiry_status_idx" ON "Enquiry"("status");
CREATE INDEX "Enquiry_createdAt_idx" ON "Enquiry"("createdAt");

-- Seed: 3 Admin users (password: Sakhar123)
INSERT INTO "Admin" ("id", "email", "password", "name") VALUES
  (gen_random_uuid()::text, 'jeshan@sakharsansar.com',  crypt('Sakhar123', gen_salt('bf', 10)), 'Jeshan Rai'),
  (gen_random_uuid()::text, 'nishan@sakharsansar.com',  crypt('Sakhar123', gen_salt('bf', 10)), 'Nishan Magar'),
  (gen_random_uuid()::text, 'rasu@sakharsansar.com',    crypt('Sakhar123', gen_salt('bf', 10)), 'Rasu Bhandari');
