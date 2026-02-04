"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardTabSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-20" />
          </div>
        </Card>

        {/* 
        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-28" />
          </div>
        </Card> 
        */}
      </div>

      <div className="mb-4">
        <Skeleton className="h-6 w-28" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-40" />
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
