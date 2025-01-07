/*
  Warnings:

  - You are about to drop the column `roll` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "roll",
ADD COLUMN     "role" TEXT DEFAULT 'user';
