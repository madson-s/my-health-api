/*
  Warnings:

  - A unique constraint covering the columns `[pin]` on the table `PasswordReset` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PasswordReset" ALTER COLUMN "expiresIn" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "expiresIn" SET DATA TYPE TIMESTAMPTZ(3);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_pin_key" ON "PasswordReset"("pin");
