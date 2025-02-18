import {Skeleton} from "@/components/ui/skeleton";
import {Card} from "@/components/ui/card";

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

          <div className="space-y-4">
            {Array.from({length: 6}).map((_, i) => (
              <Card key={i} className="flex overflow-hidden border rounded-xl p-0">
                {/* Left side - Image */}
                <Skeleton className="relative w-[400px] h-[300px]" />

                {/* Right side - Content */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>

                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>

                  <Skeleton className="h-20 w-full" />

                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
