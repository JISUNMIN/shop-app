"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";

import { LocalizedText } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import useWishlist from "@/hooks/useWishlist";
import useWishlistedProduct from "@/hooks/useWishlistedProduct";
import { getLocalWishlist, removeLocalWishlist } from "@/utils/storage/wishlistLocal";

type Props = {
  iconOnlyTrigger?: boolean;
};

export default function WishlistSheet({ iconOnlyTrigger = true }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as keyof LocalizedText;

  const { data: session } = useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [localIds, setLocalIds] = useState<number[]>([]);

  const { productIds: serverIds, deleteWishlistMutate } = useWishlist();
  const displayIds = useMemo(() => (user ? serverIds : localIds), [user, serverIds, localIds]);

  const { listData } = useWishlistedProduct(displayIds);

  const onClickDelete = (productId: number) => async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      removeLocalWishlist(productId);
      setLocalIds((prev) => prev.filter((x) => x !== productId));
      window.dispatchEvent(new Event("wishlist:changed"));
      return;
    }

    await deleteWishlistMutate({ productId });
  };

  useEffect(() => {
    if (user) return;

    const sync = () => {
      setLocalIds(getLocalWishlist());
    };
    sync();

    window.addEventListener("wishlist:changed", sync);
    // 다른 탭에서 localStorage 변경 감지
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("wishlist:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [user]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative">
          <Heart className="h-5 w-5" />
          {displayIds.length > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-[10px]"
            >
              {displayIds.length > 99 ? "99+" : displayIds.length}
            </Badge>
          )}
          {!iconOnlyTrigger && (
            <span className="hidden sm:ml-2 sm:inline">{t("mypage.tabs.wishlist")}</span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[92vw] sm:w-[420px] overflow-y-auto">
        <SheetHeader className="mt-8">
          <SheetTitle className="flex items-center justify-between">
            <span>{t("mypage.tabs.wishlist")}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {t("totalProductsCount", { count: displayIds.length })}
            </span>
          </SheetTitle>
        </SheetHeader>

        {listData?.length ? (
          <div className="space-y-3">
            {listData.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                onClick={() => setOpen(false)}
                className="block"
              >
                <Card className="p-3 bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex gap-3">
                    <img
                      src={p.images?.[0] ?? "/placeholder.jpg"}
                      alt={p.name?.[lang] ?? ""}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{p.name?.[lang]}</p>
                      <p className="text-base font-bold text-blue-600">
                        {t("price", { price: p.price.toLocaleString() })}
                      </p>

                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            // TODO: addCart 호출
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          {t("cart")}
                        </Button>

                        <Button variant="outline" size="sm" onClick={onClickDelete(p.id)}>
                          {t("delete")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            {user ? (
              <div className="pt-2">
                <Link href="/mypage?tab=wishlist" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {t("viewAll")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground flex items-center justify-between">
                <span>{t("wishlist.loginHint")}</span>

                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button size="sm" variant="outline">
                    {t("auth.login")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">{t("wishlist.empty")}</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
