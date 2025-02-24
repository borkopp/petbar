import Link from "next/link";
import {createClient} from "@/lib/supabase/server";

import ListingsFilters from "@/components/listings/filters";
import ListingCard from "@/components/listings/listing-card";
import SortSelect from "@/components/listings/sort-select";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import type {Database} from "@/database.types";

type PetListing = Database["public"]["Tables"]["pet_listings"]["Row"] & {
  pet_images: {url: string}[];
  breed: Database["public"]["Tables"]["breeds"]["Row"] | null;
};

interface SearchParams {
  type?: string;
  category?: string;
  breed?: string;
  price?: string;
  age?: string;
  gender?: string;
  location?: string;
  pedigree?: string;
  vaccinated?: string;
  sort?: string;
}

interface PageProps {
  params: Promise<object>;
  searchParams: Promise<SearchParams>;
}

function getListingTitle(searchParams: SearchParams, categoryName?: string | null) {
  const parts = [];

  if (searchParams.category && categoryName) {
    parts.push(categoryName);
  }

  if (searchParams.breed) {
    parts.push(searchParams.breed);
  }

  if (searchParams.location) {
    parts.push(`во ${searchParams.location}`);
  }

  if (parts.length > 0) {
    return `Пребарување на ${parts.join(" ")}`;
  }

  return "Сите огласи";
}

export default async function ListingsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  // Fetch category name if category filter is applied
  let categoryName = null;
  if (searchParams.category) {
    const {data: category} = await supabase.from("categories").select("name").eq("slug", searchParams.category).single();
    categoryName = category?.name;
  }

  // Build the query
  let query = supabase.from("pet_listings").select(
    `
      *,
      pet_images (
        url
      ),
      breed:breed_id (
        id,
        name
      )
    `
  );

  // Apply filters
  if (searchParams.type) {
    query = query.eq("listing_type", searchParams.type);
  }

  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  // Add breed filtering using the breed name
  if (searchParams.breed) {
    const {data: breedData} = await supabase.from("breeds").select("id").eq("name", searchParams.breed).single();

    if (breedData) {
      query = query.eq("breed_id", breedData.id);
    }
  }

  if (searchParams.price) {
    const [min, max] = searchParams.price.split("-").map(Number);
    query = query.gte("price", min).lte("price", max);
  }

  if (searchParams.age) {
    const [min, max] = searchParams.age.split("-").map(Number);
    query = query.gte("age", min).lte("age", max);
  }

  if (searchParams.gender) {
    query = query.eq("gender", searchParams.gender);
  }

  if (searchParams.location) {
    query = query.eq("location", searchParams.location);
  }

  if (searchParams.pedigree === "true") {
    query = query.eq("pedigree", true);
  }

  if (searchParams.vaccinated === "true") {
    query = query.eq("vaccine", true);
  }

  // Apply sorting
  switch (searchParams.sort) {
    case "price-asc":
      query = query.order("price", {ascending: true});
      break;
    case "price-desc":
      query = query.order("price", {ascending: false});
      break;
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
  const {data: rawListings, error} = await query;

  // Log error if any
  if (error) {
    console.error("Error fetching listings:", error);
  }

  const listings = rawListings ?? [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 md:flex-none">
          <div className="sticky top-20">
            <ListingsFilters />
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
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{getListingTitle(searchParams, categoryName)}</h1>
            <p className="text-sm text-muted-foreground">
              {listings.length} {listings.length === 1 ? "оглас" : "огласи"}
            </p>
          </div>

          <div className="max-w-4xl justify-end flex">
            <SortSelect />
          </div>

          {listings.length === 0 ? (
            <div className="flex h-[450px] items-center justify-center rounded-lg border border-dashed">
              <div className="mx-auto max-w-[420px] text-center">
                <h3 className="mt-4 text-lg font-semibold">Нема пронајдено огласи</h3>
                <p className="mt-2 text-sm text-muted-foreground">Променете ги филтрите за да видите повеќе огласи.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 max-w-4xl">
              {listings.map((listing: PetListing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  description={listing.description ?? undefined}
                  location={listing.location}
                  vaccine={listing.vaccine ?? undefined}
                  pedigree={listing.pedigree ?? undefined}
                  images={listing.pet_images}
                  createdAt={listing.created_at ?? new Date().toISOString()}
                  breed={listing.breed?.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
