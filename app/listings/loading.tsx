import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import Link from "next/link";

export default function ListingsLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 md:flex-none">
          <div className="sticky top-20">
            {/* Filters Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>

            {/* Filter Groups */}
            <div className="space-y-4">
              {Array.from({length: 6}).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <div className="space-y-2">
                    {Array.from({length: 3}).map((_, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* New Listing Button */}
            <div className="mt-4 w-full">
              <Button asChild className="w-full">
                <Link href="/create-listing" className="flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" />
                  Нов оглас
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="max-w-4xl space-y-6">
            {/* Search Bar Skeleton */}
            <div className="flex flex-col md:flex-row gap-2">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-[88px]" />
            </div>

            {/* Title and Sort Skeleton */}
            <div className="justify-between flex">
              <div className="space-y-1">
                <Skeleton className="h-7 w-48" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          {/* Listing Cards Skeleton */}
          <div className="flex flex-col gap-6 max-w-4xl">
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} className="flex overflow-hidden border rounded-xl">
                {/* Image */}
                <Skeleton className="w-[400px] h-[300px]" />

                {/* Content */}
                <div className="flex-1 p-6 space-y-6">
                  {/* Location and Date */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>

                  {/* Title */}
                  <Skeleton className="h-7 w-3/4" />

                  {/* Breed */}
                  <Skeleton className="h-4 w-1/4" />

                  {/* Description */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>

                  {/* Price */}
                  <Skeleton className="h-6 w-32" />

                  {/* Badges */}
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <Skeleton className="h-8 w-32 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
