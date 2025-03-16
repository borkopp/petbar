import {Skeleton} from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      {/* User Profile Card */}
      <div className="mb-10 w-full">
        <div className="w-full overflow-hidden border rounded-lg shadow-lg">
          {/* Cover Image */}
          <Skeleton className="h-32 w-full" />

          {/* Profile Content */}
          <div className="px-6 pb-8">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center -mt-12">
              <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
              <div className="mt-4 text-center">
                <Skeleton className="h-6 w-48 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto mt-1" />
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Account Info */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                  {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                  {Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full">
        {/* Tab List */}
        <Skeleton className="h-10 w-full mb-10" />

        {/* Tab Content */}
        <div className="rounded-lg border p-6 shadow-sm">
          {/* Profile Form */}
          <div className="space-y-6">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            <Skeleton className="h-10 w-32 mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
