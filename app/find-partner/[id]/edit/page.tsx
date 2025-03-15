import {Metadata} from "next";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import EditPartnerListingForm from "@/components/partner-listing/edit-partner-listing-form";

export const metadata: Metadata = {
  title: "Измени оглас за партнер - petbar.mk",
  description: "Измени го вашиот оглас за партнер на petbar.mk",
};

interface PageProps {
  params: Promise<{id: string}>;
}

export default async function EditPartnerListingPage({params}: PageProps) {
  const supabase = await createClient();
  const {id} = await params;

  // Check if user is authenticated
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?redirect=/find-partner/" + id + "/edit");
  }

  // Fetch the listing with its images
  const {data: listing, error: listingError} = await supabase
    .from("partner_listings")
    .select(
      `
      *,
      partner_images (
        id,
        url,
        is_primary
      )
    `
    )
    .eq("id", id)
    .single();

  // If listing doesn't exist or there was an error, redirect to 404
  if (listingError || !listing) {
    redirect("/404");
  }

  // Check if the user is the owner of the listing
  if (listing.user_id !== user.id) {
    redirect("/find-partner/" + id);
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <EditPartnerListingForm user={user} listing={listing} />
    </div>
  );
}
