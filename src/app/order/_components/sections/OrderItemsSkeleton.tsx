import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrderItemsSkeleton() {
  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-16" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 pb-4 border-b last:border-b-0">
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-lg" />

            <div className="flex-1 min-w-0">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
