"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ProfileForm from "./profile-form";
import MyListings from "./my-listings";
import type {Tables} from "@/database.types";
import {User2, List} from "lucide-react";

interface ProfileTabsProps {
  profile: Tables<"profiles">;
  listings: Array<
    Tables<"pet_listings"> & {
      pet_images: Array<Tables<"pet_images">>;
    }
  >;
  defaultTab?: string;
}

export default function ProfileTabs({profile, listings, defaultTab = "profile"}: ProfileTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "listings") {
      params.set("tab", "listings");
    } else {
      params.delete("tab");
    }
    router.push(`/profile?${params.toString()}`);
  };

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6" onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="profile">
          <User2 className="h-4 w-4 mr-2" />
          Профил
        </TabsTrigger>
        <TabsTrigger value="listings">
          <List className="h-4 w-4 mr-2" />
          Мои огласи
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="space-y-6">
        <div className="rounded-lg border p-6 shadow-sm">
          <ProfileForm profile={profile} />
        </div>
      </TabsContent>
      <TabsContent value="listings" className="space-y-6">
        <MyListings listings={listings} />
      </TabsContent>
    </Tabs>
  );
}
