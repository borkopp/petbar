import {Skeleton} from "@/components/ui/skeleton";

export default function CreateListingLoading() {
  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 md:py-10 md:px-6">
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 md:w-80 mb-2" />
        <Skeleton className="h-5 w-full md:w-3/4 max-w-2xl" />
      </div>

      {/* Form Skeleton */}
      <div className="space-y-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-16 mt-2" />
            </div>
          ))}
        </div>

        {/* Form Sections */}
        {Array.from({length: 3}).map((_, i) => (
          <div key={i} className="space-y-6 border p-4 md:p-6 rounded-lg">
            <Skeleton className="h-7 w-48 md:w-64" />

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full hidden md:block" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        ))}

        {/* Image Upload Section */}
        <div className="border p-4 md:p-6 rounded-lg space-y-4">
          <Skeleton className="h-7 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({length: 4}).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Skeleton className="h-10 w-24 md:w-32" />
          <Skeleton className="h-10 w-24 md:w-32" />
        </div>
      </div>
    </div>
  );
}
