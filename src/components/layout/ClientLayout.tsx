"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axiosSession from "@/lib/axiosSession";
import { getLocalWishlist, clearLocalWishlist } from "@/utils/storage/wishlistLocal";
import { useQueryClient } from "@tanstack/react-query";

export default function ClientLayout() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const queryClient = useQueryClient();
  const didSyncRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (didSyncRef.current) return;
    const localIds = getLocalWishlist();
    if (!localIds || localIds.length === 0) {
      didSyncRef.current = true;
      return;
    }
    didSyncRef.current = true;

    (async () => {
      try {
        await axiosSession.post("/wishlist/batch", {
          productIds: localIds,
        });

        clearLocalWishlist();

        queryClient.invalidateQueries({
          queryKey: ["wishlist", "list"],
        });
      } catch (e) {
        console.error("wishlist sync failed", e);
      }
    })();
  }, [status, user, queryClient]);

  return null;
}
