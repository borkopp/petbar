import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ListingGallery from "@/components/listings/listing-gallery";
import ListingInfo from "@/components/listings/listing-info";
import SellerCard from "@/components/listings/seller-card";
import ContactInfo from "@/components/listings/contact-info";
import PetDetails from "@/components/listings/pet-details";

interface PageProps {
  params: Promise<{id: string}>;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  searchParams: Promise<{}>;
}

export default async function ListingPage(props: PageProps) {
  const params = await props.params;
  const supabase = await createClient();

  const {data: listing, error} = await supabase
    .from("pet_listings")
    .select(
      `
      *,
      pet_images (
        id,
        url,
        is_primary
      ),
      profiles!pet_listings_user_id_fkey (
        id,
        username,
        avatar_url,
        created_at,
        rating
      )
    `
    )
    .eq("id", params.id)
    .single();

  if (error || !listing) {
    console.error("Error fetching listing:", error);
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left section - Gallery and Details */}
        <div className="lg:col-span-3 space-y-6">
          <ListingGallery images={listing.pet_images} />

          <div>
            <h1 className="text-3xl font-semibold mb-6">{listing.title}</h1>

            <PetDetails
              age={listing.age}
              gender={listing.gender}
              breed={listing.breed}
              color={listing.color}
              weight={listing.weight}
              pedigree={listing.pedigree}
              vaccine={listing.vaccine}
              description={listing.description}
            />
          </div>
        </div>

        {/* Right section - Info */}
        <div className="lg:col-span-2 space-y-6">
          <ListingInfo id={listing.id} breed={listing.breed} price={listing.price} location={listing.location} />

          <SellerCard seller={listing.profiles} responseTime="1 час" responseRate={100} />

          <ContactInfo location={listing.location} phone="0177/49..." website="Website anzeigen" />
        </div>
      </div>
    </div>
  );
}
