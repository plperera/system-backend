/*
  Warnings:

  - Made the column `CPForCNPJ` on table `clients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "CPForCNPJ" SET NOT NULL,
ALTER COLUMN "CPForCNPJ" SET DATA TYPE TEXT;
