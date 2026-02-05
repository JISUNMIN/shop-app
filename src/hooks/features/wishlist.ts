import { User } from "next-auth";

interface toggleWishlistProps {
  e?: React.MouseEvent<HTMLButtonElement>;
  productId: number;
  isWishlisted: boolean;
  user?: User | null;
  setIsWishlisted: (v: boolean) => void;
  addWishlistMutate: any;
  deleteWishlistMutate: any;
  addLocalWishlist: (id: number) => void;
  removeLocalWishlist: (id: number) => void;
}

export function toggleWishlist({
  e,
  productId,
  isWishlisted,
  user,
  setIsWishlisted,
  addWishlistMutate,
  deleteWishlistMutate,
  addLocalWishlist,
  removeLocalWishlist,
}: toggleWishlistProps) {
  e?.preventDefault();
  e?.stopPropagation();

  const next = !isWishlisted;
  setIsWishlisted(next);

  try {
    // 비로그인
    if (!user) {
      if (next) addLocalWishlist(productId);
      else removeLocalWishlist(productId);
      window.dispatchEvent(new Event("wishlist:changed"));
      return;
    }

    // 로그인
    if (next) {
      addWishlistMutate(
        { productId },
        {
          onError: (err: unknown) => {
            console.error(err);
            setIsWishlisted(false);
          },
        },
      );
    } else {
      deleteWishlistMutate(
        { productId },
        {
          onError: (err: unknown) => {
            console.error(err);
            setIsWishlisted(true);
          },
        },
      );
    }
  } catch (error) {
    console.error(error);
    setIsWishlisted(!next);

    // 비로그인 롤백
    if (!user) {
      if (!next) addLocalWishlist(productId);
      else removeLocalWishlist(productId);
    }
  }
}
