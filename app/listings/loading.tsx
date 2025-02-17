import {Skeleton} from "@/components/ui/skeleton";

export default function ListingsLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 md:flex-none">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-2">
              {Array.from({length: 6}).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({length: 9}).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
