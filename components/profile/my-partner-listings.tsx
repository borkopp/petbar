"use client";

import * as React from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {toast} from "sonner";
import {Edit, Loader2, MoreHorizontal, Plus, Trash} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {BlurImage} from "@/components/ui/blur-image";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
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
import type {Tables} from "@/database.types";

export interface MyPartnerListingsProps {
  partnerListings: (Tables<"partner_listings"> & {
    partner_images: Tables<"partner_images">[];
  })[];
}

export default function MyPartnerListings({partnerListings}: MyPartnerListingsProps) {
  const [listings, setListings] = React.useState(partnerListings);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);

      // Delete the listing
      const {error} = await supabase.from("partner_listings").delete().eq("id", id);

      if (error) {
        throw error;
      }

      // Update the local state
      setListings((prev) => prev.filter((listing) => listing.id !== id));

      toast.success("Огласот е успешно избришан");
      router.refresh();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Грешка при бришење на огласот", {
        description: error instanceof Error ? error.message : "Обидете се повторно подоцна",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 mt-10">
      {listings.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Немате активни огласи</h3>
          <p className="mt-2 text-sm text-muted-foreground">Креирајте нов оглас за да најдете партнер за вашето милениче.</p>
          <Button asChild className="mt-4">
            <Link href="/create-partner-listing">
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
                  src={listing.partner_images.length > 0 ? listing.partner_images[0].url : "https://placehold.co/600x600/png?text=No+Image"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="line-clamp-1 text-lg font-semibold">{listing.title}</h3>
                <p className="line-clamp-1 text-sm text-muted-foreground">{listing.location}</p>
                {listing.is_price_negotiable ? (
                  <p className="mt-2 font-medium">По договор</p>
                ) : (
                  <p className="mt-2 font-medium">{listing.price?.toLocaleString()} ден</p>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/find-partner/${listing.id}`}>Прегледај</Link>
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
                      <Link href={`/find-partner/${listing.id}/edit`} className="flex w-full cursor-pointer items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Измени
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
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
                            {isDeleting === listing.id ? (
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
