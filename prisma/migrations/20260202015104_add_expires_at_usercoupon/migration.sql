/*
  Warnings:

  - A unique constraint covering the columns `[userId,couponId]` on the table `user_coupons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `user_coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_coupons" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_coupons_userId_couponId_key" ON "user_coupons"("userId", "couponId");
