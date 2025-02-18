import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ListingSuccess from "@/components/listing-success";

type SearchParams = {id?: string | undefined};

export const metadata: Metadata = {
  title: "Success - Create Listing",
};

export default async function SuccessPage({searchParams}: {searchParams: SearchParams}) {
  const supabase = await createClient();

  if (!searchParams.id) {
    redirect("/");
  }

  const getListingData = async () => {
    const {data: listing} = await supabase.from("pet_listings").select("id").eq("id", searchParams.id).single();

    if (!listing) {
      redirect("/");
    }

    return listing;
  };

  const listing = await getListingData();

  return <ListingSuccess listingId={listing.id} />;
}
