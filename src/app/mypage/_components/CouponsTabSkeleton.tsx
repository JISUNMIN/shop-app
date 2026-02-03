"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CouponsTabSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div>
      <Skeleton className="h-8 w-40 md:w-56 mb-2" />
      <Skeleton className="h-5 w-56 md:w-72 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <Card key={idx} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-20">
              <Skeleton className="w-24 h-24 rounded-full" />
            </div>

            <div className="p-6 relative">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="w-8 h-8 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-4 md:p-6 bg-gray-50 border-dashed">
        <Skeleton className="h-4 w-56 mx-auto mb-3" />

        <div className="flex flex-col sm:flex-row gap-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-28 rounded-md" />
        </div>

        <Skeleton className="h-4 w-40 mt-2" />
      </Card>
    </div>
  );
}
