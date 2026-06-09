-- SakharSansar Database Schema
-- Run: psql -U postgres -d sakharsansar -f schema.sql
--
-- This script is idempotent — safe to run repeatedly against an existing
-- database. Postgres has no "CREATE TYPE IF NOT EXISTS", so enums are guarded
-- with DO blocks that ignore the "already exists" error.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "EnquiryType" AS ENUM ('B2C', 'B2B', 'GIFTING', 'PARTNERSHIP', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "B2BType" AS ENUM ('RETAILER', 'WHOLESALER', 'DISTRIBUTOR', 'CAFE_RESTAURANT', 'SUPERMARKET', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Admin table
CREATE TABLE IF NOT EXISTS "Admin" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email"     TEXT NOT NULL,
    "password"  TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");

-- Order table
CREATE TABLE IF NOT EXISTS "Order" (
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
CREATE TABLE IF NOT EXISTS "Expense" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title"       TEXT NOT NULL,
    "amount"      DOUBLE PRECISION NOT NULL,
    "category"    TEXT NOT NULL,
    "description" TEXT,
    "date"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- Enquiry table (storefront contact form)
CREATE TABLE IF NOT EXISTS "Enquiry" (
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
CREATE INDEX IF NOT EXISTS "Enquiry_status_idx" ON "Enquiry"("status");
CREATE INDEX IF NOT EXISTS "Enquiry_createdAt_idx" ON "Enquiry"("createdAt");

-- B2B clients table (wholesale/retail shops we supply)
CREATE TABLE IF NOT EXISTS "B2BClient" (
    "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "shopName"      TEXT NOT NULL,
    "contactPerson" TEXT,
    "phone"         TEXT NOT NULL,
    "altPhone"      TEXT,
    "email"         TEXT,
    "type"          "B2BType" NOT NULL DEFAULT 'RETAILER',
    "address"       TEXT NOT NULL,
    "mapUrl"        TEXT,
    "notes"         TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy"     TEXT,
    "updatedBy"     TEXT,
    "deletedAt"     TIMESTAMP(3),
    "deletedBy"     TEXT,
    CONSTRAINT "B2BClient_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "B2BClient_type_idx" ON "B2BClient"("type");
CREATE INDEX IF NOT EXISTS "B2BClient_createdAt_idx" ON "B2BClient"("createdAt");

-- Seed: 3 Admin users (password: Sakhar123)
-- ON CONFLICT keeps re-runs from failing on the unique email index.
INSERT INTO "Admin" ("id", "email", "password", "name") VALUES
  (gen_random_uuid()::text, 'jeshan@sakharsansar.com',  crypt('Sakhar123', gen_salt('bf', 10)), 'Jeshan Rai'),
  (gen_random_uuid()::text, 'nishan@sakharsansar.com',  crypt('Sakhar123', gen_salt('bf', 10)), 'Nishan Magar'),
  (gen_random_uuid()::text, 'rasu@sakharsansar.com',    crypt('Sakhar123', gen_salt('bf', 10)), 'Rasu Bhandari')
ON CONFLICT ("email") DO NOTHING;
