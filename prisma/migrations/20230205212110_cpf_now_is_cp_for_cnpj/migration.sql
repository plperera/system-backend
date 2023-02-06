/*
  Warnings:

  - You are about to drop the column `cpf` on the `clients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[CPForCNPJ]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "clients_cpf_key";

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "cpf",
ADD COLUMN     "CPForCNPJ" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "clients_CPForCNPJ_key" ON "clients"("CPForCNPJ");
