"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersTabSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div>
      <Skeleton className="h-8 w-40 md:w-56 mb-6" />

      <div className="flex gap-2 mb-6 flex-wrap">
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: count }).map((_, idx) => (
          <Card key={idx} className="p-4 md:p-6 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-56 md:w-80" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* bottom row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-3">
              <Skeleton className="h-7 w-28 md:w-36" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
