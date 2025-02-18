import type {Metadata} from "next";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ListingSuccess from "@/components/listing-success";

export const metadata: Metadata = {
  title: "Success - Create Listing",
  description: "Your listing has been successfully created",
};

export default async function SuccessPage() {
  const cookieStore = await cookies();
  const listingId = cookieStore.get("new_listing_id")?.value;

  // Clear the cookie after reading it
  cookieStore.delete("new_listing_id");

  if (!listingId) {
    redirect("/");
  }

  const supabase = await createClient();
  const {data: listing} = await supabase.from("pet_listings").select("id").eq("id", listingId).single();

  if (!listing) {
    redirect("/");
  }

  return <ListingSuccess listingId={listing.id} />;
}
