"use client";

import {Verified, Shield, Award} from "lucide-react";
import {formatDistanceToNow} from "date-fns";
import {mk} from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

interface ListingCardProps {
  id: string;
  title: string;
  price: number | null;
  location: string;
  images: {url: string}[];
  createdAt: string;
  hasIdentityVerified?: boolean;
  vaccine?: boolean;
  pedigree?: boolean;
  description?: string;
}

export default function ListingCard({
  id,
  title,
  price,
  location,
  images,
  createdAt,
  hasIdentityVerified,
  vaccine,
  pedigree,
  description,
}: ListingCardProps) {
  return (
    <Card className="flex overflow-hidden border rounded-xl font-rubik">
      {/* Left side - Image */}
      <Link href={`/listings/${id}`} className="relative w-[400px] h-[300px]">
        <Image src={images[0]?.url || "/placeholder.png"} alt={title} fill className="object-cover" />
      </Link>

      {/* Right side - Content */}
      <div className="flex-1 p-6">
        {/* Top row - Location and Date */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{location}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: mk,
            })}
          </p>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-3 line-clamp-2">{title}</h3>

        {/* Description */}
        {description && <p className="text-sm line-clamp-3 mb-4">{description}</p>}

        {/* Price */}
        <div className="mb-4">
          {price ? (
            <p className="text-xl text-muted-foreground font-semibold">{price.toLocaleString()} ден</p>
          ) : (
            <Badge variant="secondary" className="text-base px-3 py-1">
              За присвојување
            </Badge>
          )}
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          {hasIdentityVerified && (
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 rounded-full border-gray-300">
              <Verified className="h-4 w-4 text-blue-500" />
              <span className="text-gray-600">Идентифициран</span>
            </Badge>
          )}
          {vaccine && (
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 rounded-full border-gray-300">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-gray-600">Вакциниран</span>
            </Badge>
          )}
          {pedigree && (
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 rounded-full border-gray-300">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-600">Педигре</span>
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
