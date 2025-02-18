import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ListingSuccess from "@/components/listing-success";

export const metadata: Metadata = {
  title: "Success - Create Listing",
  description: "Your listing has been successfully created",
};

async function getListingData(id: string) {
  "use server";
  const supabase = await createClient();
  const {data, error} = await supabase.from("pet_listings").select("id").eq("id", id).single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function SuccessPage({searchParams}: {searchParams: {[key: string]: string | string[] | undefined}}) {
  const id = searchParams.id;

  if (!id || typeof id !== "string") {
    redirect("/");
  }

  const listing = await getListingData(id);

  if (!listing) {
    redirect("/");
  }

  return <ListingSuccess listingId={listing.id} />;
}
