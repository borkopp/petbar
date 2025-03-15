import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {PartnerListingsCarousel} from "@/components/home/partner-listings-carousel";

export async function PartnerListings() {
  const supabase = await createClient();

  // Fetch the 8 newest partner listings with their images
  const {data: listings, error} = await supabase
    .from("partner_listings")
    .select(
      `
      id,
      title,
      description,
      location,
      dog_breed,
      dog_age,
      dog_gender,
      dog_pedigree,
      dog_vaccinated,
      desired_breed,
      desired_gender,
      pedigree_required,
      vaccination_required,
      price,
      is_price_negotiable,
      created_at,
      partner_images (
        id,
        url,
        is_primary
      )
    `
    )
    .order("created_at", {ascending: false})
    .limit(8);

  if (error) {
    console.error("Error fetching partner listings:", error);
    return null;
  }

  // Format the listings for the carousel component
  const formattedListings = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    location: listing.location,
    dogBreed: listing.dog_breed,
    dogAge: listing.dog_age,
    dogGender: listing.dog_gender,
    dogPedigree: listing.dog_pedigree,
    dogVaccinated: listing.dog_vaccinated,
    desiredBreed: listing.desired_breed,
    desiredGender: listing.desired_gender,
    pedigreeRequired: listing.pedigree_required,
    vaccinationRequired: listing.vaccination_required,
    price: listing.price,
    isPriceNegotiable: listing.is_price_negotiable,
    createdAt: listing.created_at,
    images: listing.partner_images,
  }));

  return (
    <section className="py-16 md:py-32 font-rubik">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6 md:mb-12 px-6 max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-medium">Најнови барања за партнери</h2>
          <Link href="/find-partner" className="text-sm font-medium text-secondary hover:underline">
            Види ги сите
          </Link>
        </div>

        <PartnerListingsCarousel listings={formattedListings} />
      </div>
    </section>
  );
}
