"use client";

import {Shield, Award, Mars, Venus} from "lucide-react";
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
  gender?: string;
  vaccine?: boolean;
  pedigree?: boolean;
  description?: string;
  breed?: string;
}

export default function ListingCard({
  id,
  title,
  price,
  location,
  images,
  createdAt,
  gender,
  vaccine,
  pedigree,
  description,
  breed,
}: ListingCardProps) {
  return (
    <Link href={`/listings/${id}`} className="block">
      <Card className="flex flex-col md:flex-row overflow-hidden border rounded-xl font-rubik hover:border-primary/50 transition-colors">
        {/* Image */}
        <div className="relative w-full md:w-[400px] aspect-video md:aspect-auto md:h-[300px]">
          <Image
            src={images && images.length > 0 && images[0]?.url ? images[0].url : "/placeholder.png"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 space-y-3 md:space-y-6">
          {/* Top row - Location and Date */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{location}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: mk,
              })}
            </p>
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-semibold line-clamp-2">{title}</h3>

          {/* Breed */}
          {breed && <p className="text-sm text-muted-foreground">{breed}</p>}

          {/* Description - Hide on mobile, truncate on desktop */}
          {description && (
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            </div>
          )}

          {/* Price */}
          <div>
            {price ? (
              <p className="text-lg md:text-xl text-muted-foreground font-rubik font-medium">{price.toLocaleString()} ден</p>
            ) : (
              <Badge variant="outline" className="text-base px-3 py-1">
                За вдомување
              </Badge>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {gender && (
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 rounded-full border-gray-300">
                {gender === "male" ? <Mars className="h-4 w-4 text-blue-500" /> : <Venus className="h-4 w-4 text-pink-500" />}
                <span className="text-gray-600">{gender === "male" ? "Машко" : "Женско"}</span>
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
    </Link>
  );
}
