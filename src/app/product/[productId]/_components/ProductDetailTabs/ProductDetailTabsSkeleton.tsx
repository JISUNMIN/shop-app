"use client";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export default function ProductDetailTabsSkeleton() {
  return (
    <section className="mt-12">
      {/* TabsNav */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20" />
          ))}
        </div>
      </div>

      <div className="mb-12 space-y-8">
        {/* 이미지 */}
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
              <Skeleton className="w-full aspect-[16/9] sm:aspect-[16/7]" />
            </div>
          ))}
        </div>

        {/*  카드 */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
          <Skeleton className="h-7 w-40 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 제품 정보 */}
        <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
          <Skeleton className="h-7 w-44 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-6">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-52" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
