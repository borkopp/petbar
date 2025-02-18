import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ListingSuccess from "@/components/listing-success";

type SearchParams = {
  id?: string;
};

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  params: {};
  searchParams: SearchParams;
}

export default async function SuccessPage({searchParams}: Props) {
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
