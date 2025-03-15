"use client";

import * as React from "react";
import Link from "next/link";
import {Plus, MoreHorizontal, Edit, Trash2, Loader2} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {BlurImage} from "@/components/ui/blur-image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import type {Tables} from "@/database.types";

interface MyListingsProps {
  listings: Array<
    Tables<"pet_listings"> & {
      pet_images: Array<Tables<"pet_images">>;
    }
  >;
}

export default function MyListings({listings: initialListings}: MyListingsProps) {
  const [listings, setListings] = React.useState(initialListings);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);

      // Delete all images from storage
      const {data: images} = await supabase.from("pet_images").select("url").eq("listing_id", id);

      if (images) {
        for (const image of images) {
          const path = image.url.split("/").slice(-2).join("/");
          await supabase.storage.from("pet-images").remove([path]);
        }
      }

      // Delete the listing (this will cascade delete pet_images records)
      const {error} = await supabase.from("pet_listings").delete().eq("id", id);

      if (error) throw error;

      setListings((prev) => prev.filter((listing) => listing.id !== id));
      toast.success("Огласот е успешно избришан!");
    } catch (error) {
      toast.error("Грешка при бришење на огласот", {
        description: "Обидете се повторно подоцна.",
      });
      console.error("Error deleting listing:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 mt-10">
      {listings.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Немате активни огласи</h3>
          <p className="mt-2 text-sm text-muted-foreground">Креирајте нов оглас за да започнете со продажба или вдомување на миленици.</p>
          <Button asChild className="mt-4">
            <Link href="/create-listing">
              <Plus className="mr-2 h-4 w-4" />
              Креирај оглас
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <BlurImage
                  src={listing.pet_images[0]?.url || "/placeholder.png"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Badge variant="outline" className="absolute left-2 top-2 bg-white capitalize text-xs">
                  {listing.category === "dog" ? "Куче" : listing.category === "cat" ? "Маче" : "Друго"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="line-clamp-1 text-lg font-semibold">{listing.title}</h3>
                <p className="line-clamp-1 text-sm text-muted-foreground">{listing.location}</p>
                {listing.price ? (
                  <p className="mt-2 font-medium">{listing.price.toLocaleString()} ден</p>
                ) : (
                  <p className="mt-2 font-medium">За вдомување</p>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/listings/${listing.id}`}>Прегледај</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Опции</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/listings/${listing.id}/edit`} className="flex w-full cursor-pointer items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Измени
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Избриши
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Дали сте сигурни?</AlertDialogTitle>
                          <AlertDialogDescription>Оваа акција не може да се врати назад. Огласот ќе биде трајно избришан.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Откажи</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(listing.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Бришење...
                              </>
                            ) : (
                              <>Избриши</>
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
