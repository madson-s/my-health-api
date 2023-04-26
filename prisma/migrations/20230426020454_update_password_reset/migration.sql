/*
  Warnings:

  - Changed the type of `expiresIn` on the `PasswordReset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PasswordReset" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "expiresIn",
ADD COLUMN     "expiresIn" INTEGER NOT NULL;
