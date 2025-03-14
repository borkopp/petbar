"use client";

import {Award, Heart, Map, Shield, User, Dog, Calendar} from "lucide-react";
import {formatDistanceToNow} from "date-fns";
import {mk} from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";

interface PartnerCardProps {
  id: string;
  title: string;
  description?: string;
  location: string;
  // User's dog information

  dog_breed?: string;
  dog_age?: number;
  dog_gender?: string;
  dog_pedigree?: boolean;
  dog_vaccinated?: boolean;
  // Partner requirements
  desired_breed?: string;
  desired_gender: string;
  pedigree_required: boolean;
  vaccination_required: boolean;
  price?: number;
  is_price_negotiable?: boolean;
  phone?: string;
  images: {url: string}[];
  createdAt: string;
}

export default function PartnerCard({
  id,
  title,
  description,
  location,
  // User's dog information
  dog_breed,
  dog_age,
  dog_gender,
  dog_pedigree,
  dog_vaccinated,
  // Partner requirements
  desired_breed,
  desired_gender,
  pedigree_required,
  vaccination_required,
  price,
  is_price_negotiable,
  images,
  createdAt,
}: PartnerCardProps) {
  // Format the gender for display
  const formattedGender = desired_gender === "male" ? "Машки" : "Женски";

  // Format the dog gender for display
  const formattedDogGender = dog_gender === "male" ? "Машко" : "Женско";

  return (
    <Link href={`/find-partner/${id}`} className="block">
      <Card className="overflow-hidden hover:shadow-md transition-shadow hover:border-secondary/50 duration-300 border">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="relative w-full md:w-1/3 aspect-video md:aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-600/10 z-10" />
            {images.length > 0 ? (
              <Image src={images[0]?.url} alt={title} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <Heart className="h-16 w-16 text-gray-200" />
              </div>
            )}
            <div className="absolute top-3 right-3 z-20">
              <Heart className="h-6 w-6 text-secondary" />
            </div>
          </div>

          {/* Right side - Content */}
          <CardContent className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Map className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{location}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                  locale: mk,
                })}
              </div>
            </div>

            {description && <p className="text-sm text-muted-foreground line-clamp-2 mt-4">{description}</p>}

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {(price !== undefined || is_price_negotiable) && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-700">
                    Цена: <span className="font-medium">{is_price_negotiable ? "По договор" : `${price?.toLocaleString()} ден`}</span>
                  </span>
                </div>
              )}

              {dog_breed && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-700">
                    Раса: <span className="font-medium">{dog_breed}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Requirements section */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Информации:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {dog_gender && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-gray-300">
                    <User className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-gray-600 text-xs">{formattedDogGender} милениче</span>
                  </Badge>
                )}

                {dog_age !== undefined && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-gray-300">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-gray-600 text-xs">{dog_age} месеци</span>
                  </Badge>
                )}

                {dog_pedigree && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-gray-300">
                    <Award className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="text-gray-600 text-xs">Има педигре</span>
                  </Badge>
                )}

                {dog_vaccinated && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-gray-300">
                    <Shield className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-gray-600 text-xs">Вакцинирано</span>
                  </Badge>
                )}
              </div>

              <h4 className="text-sm font-medium text-gray-700 mb-2">Се бара:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-gray-300">
                  <User className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-gray-600 text-xs">{formattedGender} партнер</span>
                </Badge>

                {desired_breed && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-gray-300">
                    <Dog className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-gray-600 text-xs">Раса: {desired_breed}</span>
                  </Badge>
                )}

                {pedigree_required && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-gray-300">
                    <Award className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="text-gray-600 text-xs">Педигре</span>
                  </Badge>
                )}

                {vaccination_required && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-gray-300">
                    <Shield className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-gray-600 text-xs">Вакцини</span>
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
