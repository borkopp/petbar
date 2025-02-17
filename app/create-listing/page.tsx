import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import CreateListing from "@/components/create-listing";

export default async function CreateListingPage() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/create-listing");
  }

  return <CreateListing user={user} />;
}
