"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 이미지 스켈레톤 */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>

        {/* 정보 스켈레톤 */}
        <div className="space-y-6">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
