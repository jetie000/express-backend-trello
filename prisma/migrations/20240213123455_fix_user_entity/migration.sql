/*
  Warnings:

  - You are about to drop the column `accessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expirationToken` on the `User` table. All the data in the column will be lost.
  - Added the required column `refreshToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessToken",
DROP COLUMN "expirationToken",
ADD COLUMN     "access" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "activationLink" TEXT,
ADD COLUMN     "refreshToken" TEXT NOT NULL;
