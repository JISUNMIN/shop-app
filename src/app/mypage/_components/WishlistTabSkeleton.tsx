"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistTabSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div>
      {/* Title */}
      <Skeleton className="h-8 w-44 md:w-56 mb-2" />
      <Skeleton className="h-5 w-56 md:w-72 mb-6" />

      <div className="space-y-4">
        {Array.from({ length: count }).map((_, idx) => (
          <Card key={idx} className="p-4 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Image */}
              <Skeleton className="w-full sm:w-24 h-48 sm:h-24 rounded-lg" />

              {/* Content */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-7 w-32" />
              </div>

              {/* Buttons */}
              <div className="flex sm:flex-col gap-2">
                <Skeleton className="h-10 w-full sm:w-28 rounded-md" />
                <Skeleton className="h-10 w-full sm:w-28 rounded-md" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
