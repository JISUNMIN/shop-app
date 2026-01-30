import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function OrderAddressSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 rounded-lg border-2 border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-14" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>

          <Skeleton className="h-4 w-44 mb-2" />
          <Skeleton className="h-4 w-full max-w-[420px]" />
          <Skeleton className="h-4 w-3/4 max-w-[360px] mt-1" />
        </div>
      ))}

      <Separator className="my-4" />

      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full mt-2" />
        </div>

        <div>
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}
