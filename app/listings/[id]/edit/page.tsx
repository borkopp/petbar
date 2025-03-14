import {Metadata} from "next";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import EditListing from "@/components/edit-listing";

export const metadata: Metadata = {
  title: "Измени оглас - petbar.mk",
  description: "Измени го вашиот оглас на petbar.mk",
};

interface PageProps {
  params: Promise<{id: string}>;
}

export default async function EditListingPage({params}: PageProps) {
  const supabase = await createClient();
  const {id} = await params;

  // Check if user is authenticated
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?redirect=/listings/" + id + "/edit");
  }

  // Fetch the listing with its images
  const {data: listing, error: listingError} = await supabase
    .from("pet_listings")
    .select(
      `
      *,
      pet_images (
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
    redirect("/listings/" + id);
  }

  // We no longer need to fetch breeds since we're not allowing breed selection
  // const {data: breeds} = await supabase
  //   .from("breeds")
  //   .select("*")
  //   .eq("category_id", listing.category === "dogs" ? 1 : listing.category === "cats" ? 2 : 3);

  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <EditListing user={user} listing={listing} />
    </div>
  );
}
