/*
  Warnings:

  - You are about to drop the column `createdat` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `isactived` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `createdat` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isactived` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedat` on the `users` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userid_fkey";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "createdat",
DROP COLUMN "isactived",
DROP COLUMN "userid",
ADD COLUMN     "createdAt" DATE NOT NULL,
ADD COLUMN     "isActived" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdat",
DROP COLUMN "isactived",
DROP COLUMN "updatedat",
ADD COLUMN     "createdAt" DATE NOT NULL,
ADD COLUMN     "isActived" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" DATE NOT NULL;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
