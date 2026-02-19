-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK', 'KAKAO', 'NAVER', 'CARD');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CARD';
