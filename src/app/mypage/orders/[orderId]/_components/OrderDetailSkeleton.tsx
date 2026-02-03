import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto flex gap-6 p-6">
        <main className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-10">
            {/* Back Button */}
            <Skeleton className="h-6 w-10" />

            {/* Header */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>

              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            {/* Delivery Info */}
            <div className="p-6 bg-blue-50 rounded-lg space-y-4">
              <Skeleton className="h-5 w-32" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-28" />

              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    {/* Image */}
                    <Skeleton className="w-24 h-24 rounded-lg" />

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                      <Skeleton className="h-3 w-24" />
                    </div>

                    {/* Price */}
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />

              <div className="p-6 border border-gray-200 rounded-lg space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-28" />

              <div className="p-6 border border-gray-200 rounded-lg space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}

                <Skeleton className="h-10 w-full rounded-lg mt-4" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="flex-1 h-12 rounded-lg" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
