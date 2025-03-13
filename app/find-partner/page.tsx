import Link from "next/link";
import {createClient} from "@/lib/supabase/server";

import PartnerFilters from "@/components/partner-listing/partner-filters";
import PartnerCard from "@/components/partner-listing/partner-card";
import PartnerSortSelect from "@/components/partner-listing/partner-sort-select";
import {Button} from "@/components/ui/button";
import {SearchBar} from "@/components/search-bar";
import {Heart, Plus} from "lucide-react";
import type {Database} from "@/database.types";

type PartnerListing = Database["public"]["Tables"]["partner_listings"]["Row"] & {
  partner_images?: {url: string}[];
  user: Database["public"]["Tables"]["profiles"]["Row"] | null;
  price?: number;
  is_price_negotiable?: boolean;
  dog_breed?: string;
  dog_age?: number;
  dog_gender?: string;
  dog_pedigree?: boolean;
  dog_vaccinated?: boolean;
};

interface SearchParams {
  category?: string;
  desired_breed?: string;
  desired_gender?: string;
  location?: string;
  pedigree_required?: string;
  vaccination_required?: string;
  price?: string;
  age?: string;
  sort?: string;
}

interface PageProps {
  params: Promise<object>;
  searchParams: Promise<SearchParams>;
}

function getListingTitle(searchParams: SearchParams, categoryName?: string | null) {
  // If breed is selected, show only breed
  if (searchParams.desired_breed) {
    return `Партнери: ${searchParams.desired_breed}`;
  }

  // If only category is selected, show category name
  if (searchParams.category && categoryName) {
    return `Партнери: ${categoryName}`;
  }

  // If only location is selected, show location
  if (searchParams.location) {
    return `Партнери во ${searchParams.location}`;
  }

  return "Сите партнери";
}

export default async function FindPartnerPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  // Fetch category name if category filter is applied
  let categoryName = null;
  if (searchParams.category) {
    const {data: category} = await supabase.from("categories").select("name").eq("slug", searchParams.category).single();
    categoryName = category?.name;
  }

  // Build the query
  let query = supabase.from("partner_listings").select(
    `
      *,
      user:user_id (
        id,
        full_name,
        avatar_url,
        username
      )
    `
  );

  // Apply filters
  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  // Add breed filtering using the breed name
  if (searchParams.desired_breed) {
    query = query.eq("desired_breed", searchParams.desired_breed);
  }

  if (searchParams.desired_gender) {
    query = query.eq("desired_gender", searchParams.desired_gender);
  }

  if (searchParams.location) {
    query = query.eq("location", searchParams.location);
  }

  if (searchParams.pedigree_required === "true") {
    query = query.eq("pedigree_required", true);
  }

  if (searchParams.vaccination_required === "true") {
    query = query.eq("vaccination_required", true);
  }

  if (searchParams.price) {
    const [min, max] = searchParams.price.split("-").map(Number);
    query = query.gte("price", min).lte("price", max);
  }

  if (searchParams.age) {
    const [min, max] = searchParams.age.split("-").map(Number);
    query = query.or(`desired_age_range->>min.gte.${min},desired_age_range->>max.lte.${max}`);
  }

  // Apply sorting
  switch (searchParams.sort) {
    case "newest":
      query = query.order("created_at", {ascending: false});
      break;
    case "oldest":
      query = query.order("created_at", {ascending: true});
      break;
    default:
      query = query.order("created_at", {ascending: false});
  }

  // Get listings
  const {data: partnerListings, error} = await query;

  // Log error if any
  if (error) {
    console.error("Error fetching partner listings:", error);
  }

  const listings = partnerListings ?? [];

  // For each listing, fetch images
  for (const listing of listings) {
    const {data: images} = await supabase.from("partner_images").select("url").eq("listing_id", listing.id).order("is_primary", {ascending: false});

    listing.partner_images = images || [];
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 md:flex-none">
          <div className="sticky top-20">
            <PartnerFilters />
            <div className="mt-4 w-full">
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/create-partner-listing" className="flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" />
                  Објави барање
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="max-w-4xl space-y-6">
            <SearchBar variant="partners" />
            <div className="justify-between flex">
              <div className="space-y-1">
                <h1 className="text-xl font-medium">
                  {getListingTitle(searchParams, categoryName)} ({listings.length})
                </h1>
                <p className="text-sm text-muted-foreground">Пронајдете совршен партнер за вашето милениче</p>
              </div>
              <PartnerSortSelect />
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="flex h-[450px] max-w-4xl items-center justify-center rounded-lg border border-dashed">
              <div className="mx-auto max-w-[420px] text-center">
                <Heart className="mx-auto h-12 w-12 text-primary/50" />
                <h3 className="mt-4 text-lg font-semibold">Нема пронајдено партнери</h3>
                <p className="mt-2 text-sm text-muted-foreground">Променете ги филтрите или објавете ново барање.</p>
                <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                  <Link href="/create-partner-listing">Објави барање</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 max-w-4xl">
              {listings.map((listing: PartnerListing) => (
                <PartnerCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  description={listing.description ?? undefined}
                  location={listing.location}
                  category={listing.category}
                  dog_breed={listing.dog_breed ?? undefined}
                  dog_age={listing.dog_age ?? undefined}
                  dog_gender={listing.dog_gender ?? undefined}
                  dog_pedigree={listing.dog_pedigree ?? false}
                  dog_vaccinated={listing.dog_vaccinated ?? false}
                  desired_breed={listing.desired_breed ?? undefined}
                  desired_gender={listing.desired_gender}
                  pedigree_required={listing.pedigree_required ?? false}
                  vaccination_required={listing.vaccination_required ?? false}
                  price={listing.price}
                  is_price_negotiable={listing.is_price_negotiable}
                  images={listing.partner_images ?? []}
                  createdAt={listing.created_at ?? new Date().toISOString()}
                  user={listing.user}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
