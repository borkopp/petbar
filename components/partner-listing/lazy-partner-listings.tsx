"use client";

import {useEffect, useState, useRef} from "react";
import PartnerCard from "@/components/partner-listing/partner-card";
import {Loader2} from "lucide-react";
import type {Database} from "@/database.types";

type User = Database["public"]["Tables"]["profiles"]["Row"] | null;

interface PartnerListing {
  id: string;
  title: string;
  description: string | null;
  location: string;
  category: string;
  dog_breed?: string;
  dog_age?: number;
  dog_gender?: string;
  dog_pedigree?: boolean;
  dog_vaccinated?: boolean;
  desired_breed?: string;
  desired_gender: string;
  pedigree_required: boolean;
  vaccination_required: boolean;
  price?: number;
  is_price_negotiable?: boolean;
  phone?: string;
  partner_images?: {url: string}[];
  created_at: string | null;
  user?: User;
}

interface LazyPartnerListingsProps {
  initialListings: PartnerListing[];
  pageSize?: number;
}

export default function LazyPartnerListings({initialListings, pageSize = 10}: LazyPartnerListingsProps) {
  const [visibleListings, setVisibleListings] = useState<PartnerListing[]>([]);
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
      {visibleListings.map((listing: PartnerListing) => (
        <PartnerCard
          key={listing.id}
          id={listing.id}
          title={listing.title}
          description={listing.description ?? undefined}
          location={listing.location}
          category={listing.category}
          dog_breed={listing.dog_breed}
          dog_age={listing.dog_age}
          dog_gender={listing.dog_gender}
          dog_pedigree={listing.dog_pedigree}
          dog_vaccinated={listing.dog_vaccinated}
          desired_breed={listing.desired_breed}
          desired_gender={listing.desired_gender}
          pedigree_required={listing.pedigree_required}
          vaccination_required={listing.vaccination_required}
          price={listing.price}
          is_price_negotiable={listing.is_price_negotiable}
          phone={listing.phone}
          images={listing.partner_images || []}
          createdAt={listing.created_at ?? new Date().toISOString()}
          user={listing.user}
        />
      ))}

      {currentPage < totalPages && (
        <div ref={loaderRef} className="flex justify-center items-center py-4">
          {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <div className="h-10" />}
        </div>
      )}

      {currentPage >= totalPages && visibleListings.length > 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">Сите партнери се прикажани</div>
      )}
    </div>
  );
}
