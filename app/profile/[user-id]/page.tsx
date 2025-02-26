import {createClient} from "@/lib/supabase/server";
import {notFound} from "next/navigation";
import {Star, MapPin, Calendar} from "lucide-react";
import {formatDistanceToNow} from "date-fns";
import {mk} from "date-fns/locale";

import {Card, CardContent} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import ListingCard from "@/components/listings/listing-card";
import {Separator} from "@/components/ui/separator";

interface PageProps {
  params: Promise<{"user-id": string}>;
  searchParams: Promise<object>;
}

export default async function ProfilePage(props: PageProps) {
  const params = await props.params;
  const userId = params["user-id"];

  const supabase = await createClient();

  // Get user profile
  const {data: profile} = await supabase
    .from("profiles")
    .select(
      `
      id,
      username,
      full_name,
      avatar_url,
      location,
      created_at,
      rating
    `
    )
    .eq("id", userId)
    .single();

  if (!profile) {
    notFound();
  }

  // Get user's listings
  const {data: listings} = await supabase
    .from("pet_listings")
    .select(
      `
      *,
      pet_images (*)
    `
    )
    .eq("user_id", userId)
    .order("created_at", {ascending: false});

  // Fetch user's reviews
  const {data: reviews} = await supabase
    .from("reviews")
    .select(
      `
      *,
      reviewer:reviewer_id (
        username,
        avatar_url
      )
    `
    )
    .eq("reviewee_id", userId)
    .order("created_at", {ascending: false});

  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
              </div>
            </div>

            {/* Stats and Info */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rating */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      <span className="text-xl font-semibold">{profile.rating?.toFixed(1) || "Нема"}</span>
                      <span className="text-muted-foreground">рејтинг</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                {profile.location && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">{profile.location.charAt(0).toUpperCase() + profile.location.slice(1)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Member Since */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">
                        Член од{" "}
                        {formatDistanceToNow(new Date(profile.created_at || new Date()), {
                          addSuffix: true,
                          locale: mk,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Listings and Reviews */}
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">Огласи</TabsTrigger>
          <TabsTrigger value="reviews">Рецензии</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-6">
          {listings && listings.length > 0 ? (
            <div className="grid gap-6">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  description={listing.description ?? undefined}
                  location={listing.location}
                  vaccine={listing.vaccine ?? undefined}
                  pedigree={listing.pedigree ?? undefined}
                  images={listing.pet_images}
                  createdAt={listing.created_at ?? new Date().toISOString()}
                  breed={listing.breed?.name}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">Корисникот нема активни огласи.</CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {reviews && reviews.length > 0 ? (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.reviewer.avatar_url || undefined} />
                        <AvatarFallback>{review.reviewer.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">@{review.reviewer.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(review.created_at || new Date()), {
                                addSuffix: true,
                                locale: mk,
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{review.rating}</span>
                          </div>
                        </div>
                        {review.comment && (
                          <>
                            <Separator className="my-4" />
                            <p className="text-muted-foreground">{review.comment}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">Корисникот нема рецензии.</CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
