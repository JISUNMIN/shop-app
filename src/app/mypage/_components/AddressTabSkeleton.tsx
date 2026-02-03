"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddressTabSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div>
      <Skeleton className="h-8 w-44 md:w-56 mb-6" />

      <div className="space-y-4 mb-6">
        {Array.from({ length: count }).map((_, idx) => (
          <Card key={idx} className="p-4 md:p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Skeleton className="h-9 w-full sm:w-20 rounded-md" />
                <Skeleton className="h-9 w-full sm:w-9 rounded-md" />
              </div>
            </div>

            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full" />
          </Card>
        ))}
      </div>

      <div className="w-full space-y-1">
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-4 w-40 mx-auto mt-2" />
      </div>
    </div>
  );
}
