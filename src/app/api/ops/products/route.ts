import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type LocalizedPayload = {
  ko: string;
  en: string;
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name: LocalizedPayload;
      category: LocalizedPayload;
      description?: LocalizedPayload;
      price: number;
      stock: number;
      images: string[];
    };

    const name = {
      ko: body.name?.ko?.trim() ?? "",
      en: body.name?.en?.trim() ?? "",
    };
    const category = {
      ko: body.category?.ko?.trim() ?? "",
      en: body.category?.en?.trim() ?? "",
    };
    const description = {
      ko: body.description?.ko?.trim() ?? "",
      en: body.description?.en?.trim() ?? "",
    };
    const price = Number(body.price);
    const stock = Number(body.stock);
    const images = (body.images ?? []).map((image) => image.trim()).filter(Boolean);

    if (!name.ko || !name.en || !category.ko || !category.en) {
      return NextResponse.json({ error: "상품명과 카테고리를 모두 입력해주세요." }, { status: 400 });
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "가격은 0보다 큰 숫자여야 합니다." }, { status: 400 });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ error: "재고는 0 이상의 정수여야 합니다." }, { status: 400 });
    }

    if (images.length === 0) {
      return NextResponse.json({ error: "대표 이미지 URL을 최소 1개 입력해주세요." }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        description: description.ko || description.en ? description : undefined,
        price,
        stock,
        images,
      },
    });

    return NextResponse.json({ ok: true, productId: product.id });
  } catch (error) {
    console.error("Ops Product Create Error:", error);
    return NextResponse.json({ error: "상품 등록에 실패했습니다." }, { status: 500 });
  }
}
