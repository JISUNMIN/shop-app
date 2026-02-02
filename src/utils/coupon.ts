import { Prisma, PrismaClient } from "@prisma/client";

function addOneMonth(base: Date) {
  const d = new Date(base);
  d.setMonth(d.getMonth() + 1);
  return d;
}

type Db = Prisma.TransactionClient | PrismaClient;

export async function issueWelcomeCouponToUser(db: Db, userId: string) {
  const coupon = await db.coupon.upsert({
    where: { code: "WELCOME_1PCT" },
    update: {},
    create: {
      code: "WELCOME_1PCT",
      name: "회원가입 1% 할인쿠폰",
      discountType: "PERCENT",
      discountValue: 1,
      isActive: true,
    },
  });

  const exists = await db.userCoupon.findFirst({
    where: { userId, couponId: coupon.id },
    select: { id: true },
  });
  if (exists) return;

  const issuedAt = new Date();

  const expiresAt = addOneMonth(issuedAt);
  expiresAt.setHours(23, 59, 59, 999);

  await db.userCoupon.create({
    data: {
      userId,
      couponId: coupon.id,
      status: "AVAILABLE",
      issuedAt,
      expiresAt,
    },
  });
}
