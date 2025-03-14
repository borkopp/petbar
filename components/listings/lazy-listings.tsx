"use client";

import {useEffect, useState, useRef} from "react";
import ListingCard from "@/components/listings/listing-card";
import {Loader2} from "lucide-react";

interface PetListing {
  id: string;
  title: string;
  price: number | null;
  description: string | null;
  location: string;
  vaccine: boolean | null;
  pedigree: boolean | null;
  gender: string | null;
  pet_images: {url: string}[];
  created_at: string | null;
  breed: {
    id: number;
    name: string;
  } | null;
}

interface LazyListingsProps {
  initialListings: PetListing[];
  pageSize?: number;
}

export default function LazyListings({initialListings, pageSize = 10}: LazyListingsProps) {
  const [visibleListings, setVisibleListings] = useState<PetListing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Calculate total pages
  const totalPages = Math.ceil(initialListings.length / pageSize);

  useEffect(() => {
    // Initialize with first page of listings
    setVisibleListings(initialListings.slice(0, pageSize));
  }, [initialListings, pageSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && currentPage < totalPages && !isLoading) {
          loadMoreListings();
        }
      },
      {threshold: 0.1}
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [currentPage, totalPages, isLoading]);

  const loadMoreListings = () => {
    setIsLoading(true);

    // Simulate network delay (remove in production)
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      const newListings = initialListings.slice(0, endIndex);

      setVisibleListings(newListings);
      setCurrentPage(nextPage);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {visibleListings.map((listing: PetListing) => (
        <ListingCard
          key={listing.id}
          id={listing.id}
          title={listing.title}
          price={listing.price}
          description={listing.description ?? undefined}
          location={listing.location}
          vaccine={listing.vaccine ?? undefined}
          pedigree={listing.pedigree ?? undefined}
          gender={listing.gender ?? undefined}
          images={listing.pet_images}
          createdAt={listing.created_at ?? new Date().toISOString()}
          breed={listing.breed?.name}
        />
      ))}

      {currentPage < totalPages && (
        <div ref={loaderRef} className="flex justify-center items-center py-4">
          {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <div className="h-10" />}
        </div>
      )}

      {currentPage >= totalPages && visibleListings.length > 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">Сите огласи се прикажани</div>
      )}
    </div>
  );
}
