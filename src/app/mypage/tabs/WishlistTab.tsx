"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useWishlist from "@/hooks/useWishlist";
import { useTranslation } from "react-i18next";
import { LocalizedText } from "@/types";
import { useSession } from "next-auth/react";
import { getLocalWishlist, removeLocalWishlist } from "@/utils/storage/wishlistLocal";
import { useEffect, useMemo, useState } from "react";
import useWishlistedProduct from "@/hooks/useWishlistedProduct";
import useCart from "@/hooks/useCart";
import WishlistTabSkeleton from "@/app/mypage/_components/WishlistTabSkeleton";

export default function WishlistTab() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as keyof LocalizedText;
  const { addToCartMutate } = useCart();
  const [pendingAddId, setPendingAddId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const { data: session } = useSession();
  const user = session?.user;

  const [localIds, setLocalIds] = useState<number[]>([]);

  useEffect(() => {
    if (user) return;
    setLocalIds(getLocalWishlist());
  }, [user]);

  const { productIds: serverIds, deleteWishlistMutate } = useWishlist();
  const { listData, isListLoading } = useWishlistedProduct(user ? serverIds : localIds);

  const displayIds = useMemo(() => {
    return user ? serverIds : localIds;
  }, [user, serverIds, localIds]);

  const onClickDelete = (productId: number) => async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setPendingDeleteId(productId);

    if (!user) {
      removeLocalWishlist(productId);
      setLocalIds((prev) => prev.filter((x) => x !== productId));
      setPendingDeleteId(null);
      return;
    }

    await deleteWishlistMutate(
      { productId },
      {
        onSettled: () => {
          setPendingDeleteId(null);
        },
      },
    );
  };

  const handleAddToCartClick = (productId: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setPendingAddId(productId);

    addToCartMutate(
      {
        productId,
        quantity: 1,
      },
      {
        onSuccess: () => {
          if (!user) {
            removeLocalWishlist(productId);
            setLocalIds((prev) => prev.filter((x) => x !== productId));
          } else deleteWishlistMutate({ productId });
        },
        onError: () => {
          setPendingAddId(null);
        },
        onSettled: () => {
          setPendingAddId(null);
        },
      },
    );
  };

  if (isListLoading) {
    return <WishlistTabSkeleton />;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("mypage.tabs.wishlist")}</h1>

      <p className="text-gray-600 mb-6">{t("totalProductsCount", { count: displayIds.length })}</p>

      <div className="space-y-4">
        {listData?.map((p) => (
          <Card key={p.id} className="p-4 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={p.images?.[0] ?? "/placeholder.jpg"}
                alt={p.name?.[lang] ?? ""}
                className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-bold mb-1">{p.name?.[lang]}</h3>
                <p className="text-xl font-bold text-blue-600">
                  {t("price", { price: p.price.toLocaleString() })}
                </p>
              </div>

              <div className="flex sm:flex-col gap-2">
                <Button onClick={handleAddToCartClick(p.id)} disabled={pendingAddId === p.id}>
                  {pendingAddId === p.id ? t("addingToCart") : t("cart")}
                </Button>

                <Button
                  variant="outline"
                  onClick={onClickDelete(p.id)}
                  disabled={pendingDeleteId === p.id}
                >
                  {pendingDeleteId === p.id ? t("deleting") : t("delete")}
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {listData?.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">{t("wishlist.empty")}</div>
        )}
      </div>
    </div>
  );
}
