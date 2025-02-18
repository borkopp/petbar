"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ProfileForm from "./profile-form";
import MyListings from "./my-listings";
import type {Tables} from "@/database.types";

interface ProfileTabsProps {
  profile: Tables<"profiles">;
  listings: Array<
    Tables<"pet_listings"> & {
      pet_images: Array<Tables<"pet_images">>;
    }
  >;
}

export default function ProfileTabs({profile, listings}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList>
        <TabsTrigger value="profile">Профил</TabsTrigger>
        <TabsTrigger value="listings">Мои Огласи</TabsTrigger>
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
