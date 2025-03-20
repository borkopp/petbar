import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import PartnerGallery from "@/components/partner-listing/partner-gallery";
import PartnerDetails from "@/components/partner-listing/partner-details";
import OwnerCard from "@/components/partner-listing/owner-card";
import ContactInfo from "@/components/partner-listing/contact-info";
import ShareSection from "@/components/partner-listing/share-section";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {Heart, MessageCircle} from "lucide-react";
import Link from "next/link";
import SellerSection from "@/components/listings/seller-section";

interface PageProps {
  params: Promise<{id: string}>;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  searchParams: Promise<{}>;
}

export default async function PartnerListingPage(props: PageProps) {
  const params = await props.params;
  const supabase = await createClient();

  // Validate ID parameter
  if (!params.id) {
    console.error("Missing ID parameter");
    notFound();
  }

  console.log("Fetching partner listing with ID:", params.id);

  // Fetch the partner listing
  const {data: listing, error} = await supabase
    .from("partner_listings")
    .select(
      `
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        username,
        created_at
      )
    `
    )
    .eq("id", params.id)
    .single();

  // More detailed error handling
  if (error) {
    console.error("Error fetching partner listing:", error);
    console.error("Error details:", JSON.stringify(error));
    notFound();
  }

  if (!listing) {
    console.error("Partner listing not found for ID:", params.id);
    notFound();
  }

  // Verify the foreign key relationship worked
  if (!listing.profiles) {
    console.warn("Partner listing found but profile data is missing. Listing:", JSON.stringify(listing));
  }

  // Fetch images for the listing
  const {data: images, error: imagesError} = await supabase
    .from("partner_images")
    .select("url")
    .eq("listing_id", listing.id)
    .order("is_primary", {ascending: false});

  if (imagesError) {
    console.warn("Error fetching partner images:", imagesError);
  }

  const partnerImages = images || [];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        {/* Gallery */}
        <PartnerGallery images={partnerImages} />

        {/* Basic Info */}
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground mb-2">{listing.location}</p>
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          {(listing.price !== undefined || listing.is_price_negotiable) && (
            <p className="text-xl font-semibold text-muted-foreground">
              {listing.is_price_negotiable ? "По договор" : `${listing.price?.toLocaleString()} ден`}
            </p>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              Детали
            </TabsTrigger>
            <TabsTrigger value="owner" className="flex-1">
              Продавач
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <PartnerDetails
              // User's dog information
              dog_breed={listing.dog_breed}
              dog_age={listing.dog_age}
              dog_gender={listing.dog_gender}
              dog_pedigree={listing.dog_pedigree}
              dog_vaccinated={listing.dog_vaccinated}
              dog_description={listing.dog_description}
              // Partner requirements
              category={listing.category}
              desired_breed={listing.desired_breed}
              desired_gender={listing.desired_gender}
              pedigree_required={listing.pedigree_required}
              vaccination_required={listing.vaccination_required}
              price={listing.price}
              is_price_negotiable={listing.is_price_negotiable}
              desired_age_range={listing.desired_age_range}
              breeding_experience={listing.breeding_experience}
              preferred_meeting_location={listing.preferred_meeting_location}
              description={listing.description}
            />
          </TabsContent>

          <TabsContent value="owner" className="mt-4 space-y-6">
            {listing.profiles && <OwnerCard owner={listing.profiles} responseTime="1 час" responseRate={100} />}
            <ContactInfo location={listing.location} phone={listing.phone || undefined} />
          </TabsContent>
        </Tabs>
        <div className="flex flex-col gap-4">
          {listing.profiles && (
            <Button asChild className="w-full">
              <Link href={`/chat/${listing.profiles.id}?listing=${listing.id}`}>
                <MessageCircle className="mr-2 h-5 w-5" />
                Испрати порака
              </Link>
            </Button>
          )}
          <Button variant="outline" className="w-full">
            <Heart className="mr-2 h-5 w-5" />
            Зачувај во омилени
          </Button>
        </div>
        <ShareSection title={listing.title} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-8">
        {/* Left section - Gallery and Details */}
        <div className="lg:col-span-3 space-y-6">
          <PartnerGallery images={partnerImages} />

          <div>
            <h1 className="text-3xl font-semibold mb-6">{listing.title}</h1>

            <PartnerDetails
              // User's dog information
              dog_breed={listing.dog_breed}
              dog_age={listing.dog_age}
              dog_gender={listing.dog_gender}
              dog_pedigree={listing.dog_pedigree}
              dog_vaccinated={listing.dog_vaccinated}
              dog_description={listing.dog_description}
              // Partner requirements
              category={listing.category}
              desired_breed={listing.desired_breed}
              desired_gender={listing.desired_gender}
              pedigree_required={listing.pedigree_required}
              vaccination_required={listing.vaccination_required}
              price={listing.price}
              is_price_negotiable={listing.is_price_negotiable}
              desired_age_range={listing.desired_age_range}
              breeding_experience={listing.breeding_experience}
              preferred_meeting_location={listing.preferred_meeting_location}
              description={listing.description}
            />
          </div>
        </div>

        {/* Right section - Info */}
        <div className="lg:col-span-2 space-y-6 self-start sticky top-24 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{listing.location}</p>
                {(listing.price !== undefined || listing.is_price_negotiable) && (
                  <p className="text-2xl font-semibold mt-1">
                    {listing.is_price_negotiable ? "По договор" : `${listing.price?.toLocaleString()} ден`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {listing.profiles && (
                <Button asChild className="w-full bg-secondary hover:bg-secondary/80">
                  <Link href={`/chat/${listing.profiles.id}?listing=${listing.id}`}>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Испрати порака
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <Heart className="mr-2 h-5 w-5" />
                Зачувај во омилени
              </Button>
            </div>
          </div>
          <SellerSection 
            seller={listing.profiles}
            location={listing.location}
            phone={listing.phone}
            listingType="partner"
          />
          <ShareSection title={listing.title} />
        </div>
      </div>
    </div>
  );
}
