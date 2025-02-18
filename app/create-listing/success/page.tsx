import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ListingSuccess from "@/components/listing-success";

export const metadata: Metadata = {
  title: "Success - Create Listing",
};

export default async function SuccessPage({searchParams}: {searchParams: {[key: string]: string | string[] | undefined}}) {
  const supabase = await createClient();

  const id = searchParams.id as string | undefined;

  if (!id) {
    redirect("/");
  }

  const {data: listing} = await supabase.from("pet_listings").select("id").eq("id", id).single();

  if (!listing) {
    redirect("/");
  }

  return <ListingSuccess listingId={listing.id} />;
}
