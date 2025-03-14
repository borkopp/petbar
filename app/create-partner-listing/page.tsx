import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {PartnerListingForm} from "@/components/partner-listing/partner-listing-form";

export default async function CreatePartnerListingPage() {
  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container max-w-3xl py-10 mx-auto px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Креирај оглас за партнер</h1>
          <p className="text-sm text-muted-foreground">Пополнете ги деталите подолу за да креирате оглас за партнер за вашето милениче</p>
        </div>
        <PartnerListingForm userId={user.id} />
      </div>
    </div>
  );
}
