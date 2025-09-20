// src/components/product/ProductSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Skeleton className="h-full w-full" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />

          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-6 w-20" />
          </div>

          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
