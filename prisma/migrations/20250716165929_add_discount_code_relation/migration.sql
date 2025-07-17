/*
  Warnings:

  - You are about to drop the column `amount` on the `DiscountCode` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `DiscountCode` table. All the data in the column will be lost.
  - Added the required column `percentage` to the `DiscountCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscountCode" DROP COLUMN "amount",
DROP COLUMN "isActive",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "percentage" DOUBLE PRECISION NOT NULL;
