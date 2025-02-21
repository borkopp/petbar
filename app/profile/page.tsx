import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ProfileTabs from "@/components/profile/profile-tabs";

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">Мој Профил</h1>
      <ProfileTabs profile={profile} listings={listings || []} defaultTab={params.tab === "listings" ? "listings" : "profile"} />
    </div>
  );
}
