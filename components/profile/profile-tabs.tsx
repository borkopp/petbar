"use client";

import {useRouter, useSearchParams} from "next/navigation";
import type {Tables} from "@/database.types";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ProfileForm from "./profile-form";
import MyListings from "./my-listings";
import MyPartnerListings from "./my-partner-listings";

export interface ProfileTabsProps {
  profile: Tables<"profiles">;
  listings: (Tables<"pet_listings"> & {
    pet_images: Tables<"pet_images">[];
  })[];
  partnerListings?: (Tables<"partner_listings"> & {
    partner_images: Tables<"partner_images">[];
  })[];
  defaultTab?: string;
}

export default function ProfileTabs({profile, listings, partnerListings = [], defaultTab = "profile"}: ProfileTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || defaultTab;

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`/profile?${params.toString()}`);
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Профил</TabsTrigger>
        <TabsTrigger value="listings">Мои огласи</TabsTrigger>
        <TabsTrigger value="partner-listings">Мои партнер огласи</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <div className="rounded-lg border p-6 shadow-sm">
          <ProfileForm profile={profile} />
        </div>
      </TabsContent>
      <TabsContent value="listings">
        <MyListings listings={listings} />
      </TabsContent>
      <TabsContent value="partner-listings">
        <MyPartnerListings partnerListings={partnerListings} />
      </TabsContent>
    </Tabs>
  );
}
