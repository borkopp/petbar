import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ListingSuccess from "@/components/listing-success";

export const metadata: Metadata = {
  title: "Success - Create Listing",
  description: "Your listing has been successfully created",
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default async function SuccessPage(props: {params: Promise<{}>; searchParams: Promise<{id?: string}>}) {
  const searchParams = await props.searchParams;
  const id = searchParams.id;

  if (!id) {
    redirect("/");
  }

  const supabase = await createClient();
  const {data: listing} = await supabase.from("pet_listings").select("id").eq("id", id).single();

  if (!listing) {
    redirect("/");
  }

  return <ListingSuccess listingId={listing.id} />;
}
