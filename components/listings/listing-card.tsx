"use client";

import Image from "next/image";
import Link from "next/link";
import {Heart} from "lucide-react";
import {formatDistanceToNow} from "date-fns";
import {mk} from "date-fns/locale";

import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

interface ListingCardProps {
  id: string;
  title: string;
  price: number | null;
  location: string;
  category: string;
  listingType: string;
  images: {url: string}[];
  createdAt: string;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

export default function ListingCard({
  id,
  title,
  price,
  location,
  category,
  listingType,
  images,
  createdAt,
  isBookmarked,
  onBookmark,
}: ListingCardProps) {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/listings/${id}`} className="relative block aspect-square">
        <Image
          src={images[0]?.url || "/placeholder.png"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {onBookmark && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={(e) => {
              e.preventDefault();
              onBookmark();
            }}>
            <Heart className={cn("h-5 w-5", isBookmarked ? "fill-red-500 text-red-500" : "text-white")} />
          </Button>
        )}
        <Badge variant="secondary" className="absolute left-2 top-2 capitalize">
          {category}
        </Badge>
      </Link>
      <CardContent className="p-4">
        <div className="space-y-1">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground capitalize">{location}</p>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
        <div>{price ? <p className="font-semibold">{price.toLocaleString()} МКД</p> : <Badge variant="secondary">Вдомување</Badge>}</div>
        <p className="text-right text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale: mk,
          })}
        </p>
      </CardFooter>
    </Card>
  );
}
