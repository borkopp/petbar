import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {NewestListingsCarousel} from "@/components/home/newest-listings-carousel";

export async function NewestListings() {
  const supabase = await createClient();

  // Fetch the 8 newest listings with their images
  const {data: listings, error} = await supabase
    .from("pet_listings")
    .select(
      `
      id,
      title,
      price,
      location,
      category,
      listing_type,
      gender,
      vaccine,
      pedigree,
      created_at,
      pet_images (
        id,
        url,
        is_primary
      )
    `
    )
    .order("created_at", {ascending: false})
    .limit(8);

  if (error) {
    console.error("Error fetching newest listings:", error);
    return null;
  }

  // Format the listings for the carousel component
  const formattedListings = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    location: listing.location,
    category: listing.category,
    listingType: listing.listing_type,
    gender: listing.gender,
    vaccinated: listing.vaccine,
    pedigree: listing.pedigree,
    createdAt: listing.created_at,
    images: listing.pet_images,
  }));

  return (
    <section className="py-8 md:py-16 font-rubik bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6 md:mb-12 max-w-6xl px-6 mx-auto">
          <h2 className="text-xl md:text-2xl font-medium">Најнови огласи за миленичиња</h2>
          <Link href="/listings" className="text-sm font-medium text-primary hover:underline">
            Види ги сите
          </Link>
        </div>

        <NewestListingsCarousel listings={formattedListings} />
      </div>
    </section>
  );
}
