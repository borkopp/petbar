import {Skeleton} from "@/components/ui/skeleton";

export default function UserProfileLoading() {
  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-6">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <Skeleton className="h-24 w-24 rounded-full" />

          {/* User Info */}
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-48 md:w-64" />
            <Skeleton className="h-5 w-32 md:w-40" />
            <div className="flex flex-wrap gap-2 mt-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            <Skeleton className="h-10 w-full md:w-32" />
            <Skeleton className="h-10 w-full md:w-32" />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-4 overflow-x-auto pb-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
