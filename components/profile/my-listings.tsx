"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {Pencil, Trash2} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
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
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
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

  if (listings.length === 0) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-lg border border-dashed">
        <div className="mx-auto max-w-[420px] text-center">
          <h3 className="mt-4 text-lg font-semibold">Немате активни огласи</h3>
          <p className="mt-2 text-sm text-muted-foreground">Креирајте нов оглас за да започнете со продажба или вдомување на миленици.</p>
          <Button asChild className="mt-4">
            <Link href="/create-listing">Креирај Оглас</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {listings.map((listing) => (
        <Card key={listing.id} className="group overflow-hidden">
          <Link href={`/listings/${listing.id}`} className="relative block aspect-[4/3]">
            <Image
              src={listing.pet_images[0]?.url || "/placeholder.png"}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Badge variant="secondary" className="absolute left-2 top-2 capitalize text-xs">
              {listing.category}
            </Badge>
          </Link>
          <CardContent className="p-2.5">
            <div className="space-y-0.5">
              <h3 className="font-medium line-clamp-1 text-sm">{listing.title}</h3>
              <p className="text-xs text-muted-foreground capitalize">{listing.location}</p>
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-1.5 p-2.5 pt-0">
            <Button variant="outline" size="sm" asChild className="h-8 text-xs">
              <Link href={`/listings/${listing.id}/edit`}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Измени
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting} className="h-8 text-xs">
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Избриши
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Дали сте сигурни?</AlertDialogTitle>
                  <AlertDialogDescription>Оваа акција не може да се врати назад. Огласот ќе биде трајно избришан.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Откажи</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(listing.id)} className="bg-destructive text-destructive-foreground">
                    Избриши
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
