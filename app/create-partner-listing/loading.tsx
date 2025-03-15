import {Skeleton} from "@/components/ui/skeleton";

export default function CreatePartnerListingLoading() {
  return (
    <div className="container max-w-3xl py-10 mx-auto px-6">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* Pet Information Accordion */}
          <div className="border rounded-lg px-4 py-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-5 w-5" />
            </div>

            <div className="pt-4 space-y-6">
              {/* Breed */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Pedigree Switch */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>

              {/* Vaccinated Switch */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>
            </div>
          </div>

          {/* Partner Requirements Accordion */}
          <div className="border rounded-lg px-4 py-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-5 w-5" />
            </div>

            <div className="pt-4 space-y-6">
              {/* Desired Breed */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Desired Gender */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Requirements Switches */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-32 mt-2" />
              </div>
              {Array.from({length: 2}).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Skeleton className="h-10 w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
}
