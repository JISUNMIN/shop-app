import {
  getLocalIds,
  addLocalId,
  removeLocalId,
  clearLocalIds,
} from "@/utils/storage/localCollection";

const WISHLIST_KEY = "wishlist_product_ids";

export const getLocalWishlist = () => getLocalIds(WISHLIST_KEY);;
export const addLocalWishlist = (id: number) => addLocalId(WISHLIST_KEY, id);
export const removeLocalWishlist = (id: number) => removeLocalId(WISHLIST_KEY, id);
export const clearLocalWishlist = () => clearLocalIds(WISHLIST_KEY);
