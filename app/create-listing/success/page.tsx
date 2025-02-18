/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ListingSuccess from "@/components/listing-success";

export const metadata: Metadata = {
  title: "Success - Create Listing",
  description: "Your listing has been successfully created",
};

type PageProps = {
  params: {};
  searchParams: {[key: string]: string | string[] | undefined};
};

export default async function SuccessPage(props: PageProps) {
  const supabase = await createClient();
  const id = props.searchParams.id;

  if (!id || typeof id !== "string") {
    redirect("/");
  }

  const {data: listing} = await supabase.from("pet_listings").select("id").eq("id", id).single();

  if (!listing) {
    redirect("/");
  }

  return <ListingSuccess listingId={listing.id} />;
}
