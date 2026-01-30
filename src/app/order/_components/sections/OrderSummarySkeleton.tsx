import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function OrderSummaryContentSkeleton() {
  return (
    <>
      <div className="space-y-3 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}

        <div className="pl-4">
          <Skeleton className="h-3 w-56" />
        </div>

        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`d-${i}`} className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-32" />
      </div>

      <Skeleton className="h-14 w-full rounded-md" />

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </>
  );
}
