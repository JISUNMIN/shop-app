import {
  getLocalIds,
  setLocalIds,
  hasLocalId,
  addLocalId,
  removeLocalId,
  clearLocalIds,
} from "@/utils/storage/localCollection";

const CART_KEY = "cart_product_ids";

export const getLocalCart = () => getLocalIds(CART_KEY);
export const setLocalCart = (ids: number[]) => setLocalIds(CART_KEY, ids);
export const hasLocalCart = (id: number) => hasLocalId(CART_KEY, id);
export const addLocalCart = (id: number) => addLocalId(CART_KEY, id);
export const removeLocalCart = (id: number) => removeLocalId(CART_KEY, id);
export const clearLocalCart = () => clearLocalIds(CART_KEY);
