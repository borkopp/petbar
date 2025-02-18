import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ListingSuccess from "@/components/listing-success";

interface PageProps {
  params: Record<string, never>;
  searchParams: {
    id?: string;
  };
}

export default async function SuccessPage({searchParams}: PageProps) {
  const supabase = await createClient();

  if (!searchParams.id) {
    redirect("/");
  }

  const {data: listing} = await supabase.from("pet_listings").select("id").eq("id", searchParams.id).single();

  if (!listing) {
    redirect("/");
  }

  return <ListingSuccess listingId={listing.id} />;
}
