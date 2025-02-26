import {notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ListingGallery from "@/components/listings/listing-gallery";
import ListingInfo from "@/components/listings/listing-info";
import SellerCard from "@/components/listings/seller-card";
import ContactInfo from "@/components/listings/contact-info";
import PetDetails from "@/components/listings/pet-details";
import ShareSection from "@/components/listings/share-section";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {Heart, MessageCircle} from "lucide-react";

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
        full_name,
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
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        {/* Gallery */}
        <ListingGallery images={listing.pet_images} />

        {/* Basic Info */}
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground mb-2">{listing.location}</p>
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          {listing.price && <p className="text-xl font-semibold text-muted-foreground">{listing.price.toLocaleString()} ден</p>}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              Детали
            </TabsTrigger>
            <TabsTrigger value="seller" className="flex-1">
              Продавач
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
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
          </TabsContent>

          <TabsContent value="seller" className="mt-4 space-y-6">
            <SellerCard seller={listing.profiles} responseTime="1 час" responseRate={100} />
            <ContactInfo location={listing.location} phone={listing.phone || "Нема број"} />
          </TabsContent>
        </Tabs>
        <div className="flex flex-col gap-4">
          <Button className="w-full">
            <MessageCircle className="mr-2 h-5 w-5" />
            Испрати порака
          </Button>
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
          <ContactInfo location={listing.location} phone={listing.phone || "Нема број"} />
          <ShareSection title={listing.title} />
        </div>
      </div>
    </div>
  );
}
