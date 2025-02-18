import {redirect} from "next/navigation";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import ListingSuccess from "@/components/listing-success";

type SearchParams = {id?: string};

interface Props {
  params: Record<string, never>;
  searchParams: SearchParams;
}

export default async function SuccessPage({searchParams}: Props) {
  const supabase = createServerComponentClient({cookies});

  if (!searchParams.id) {
    redirect("/");
  }

  const {data: listing} = await supabase.from("pet_listings").select("id").eq("id", searchParams.id).single();

  if (!listing) {
    redirect("/");
  }

  return <ListingSuccess listingId={listing.id} />;
}
