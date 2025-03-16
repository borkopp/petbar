import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ProfileTabs from "@/components/profile/profile-tabs";
import {UserProfile} from "@/components/user-profile";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Мојот профил - petbar.mk",
  description: "Управувајте со вашиот профил и огласи на petbar.mk",
};

interface SearchParams {
  tab?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProfilePage({searchParams}: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: {user},
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const {data: profile} = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const {data: listings} = await supabase
    .from("pet_listings")
    .select(
      `
      *,
      pet_images (
        url,
        is_primary
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", {ascending: false});

  // Fetch partner listings
  const {data: partnerListings} = await supabase
    .from("partner_listings")
    .select(
      `
      *,
      partner_images (
        url,
        is_primary
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", {ascending: false});

  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <div className="mb-10 w-full">
        <UserProfile />
      </div>
      <ProfileTabs profile={profile} listings={listings || []} partnerListings={partnerListings || []} defaultTab={params.tab || "profile"} />
    </div>
  );
}
