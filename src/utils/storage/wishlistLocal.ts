import {
  getLocalIds,
  setLocalIds,
  hasLocalId,
  addLocalId,
  removeLocalId,
  clearLocalIds,
} from "@/utils/storage/localCollection";

const WISHLIST_KEY = "wishlist_product_ids";

export const getLocalWishlist = () => getLocalIds(WISHLIST_KEY);
export const setLocalWishlist = (ids: number[]) => setLocalIds(WISHLIST_KEY, ids);
export const hasLocalWishlist = (id: number) => hasLocalId(WISHLIST_KEY, id);
export const addLocalWishlist = (id: number) => addLocalId(WISHLIST_KEY, id);
export const removeLocalWishlist = (id: number) => removeLocalId(WISHLIST_KEY, id);
export const clearLocalWishlist = () => clearLocalIds(WISHLIST_KEY);
