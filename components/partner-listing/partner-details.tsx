"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Check, X, Award, MapPin} from "lucide-react";

interface PartnerDetailsProps {
  // User's dog information
  dog_breed?: string;
  dog_age?: number;
  dog_gender?: string;
  dog_pedigree?: boolean;
  dog_vaccinated?: boolean;
  dog_description?: string;
  // Partner requirements
  category?: string;
  desired_breed?: string;
  desired_gender: string;
  pedigree_required: boolean;
  vaccination_required: boolean;
  price?: number;
  is_price_negotiable?: boolean;
  desired_age_range?: {
    min: number;
    max: number;
  };
  breeding_experience?: string;
  preferred_meeting_location?: string;
  description?: string;
}

export default function PartnerDetails({
  // User's dog information
  dog_breed,
  dog_age,
  dog_gender,
  dog_pedigree,
  dog_vaccinated,
  dog_description,
  // Partner requirements
  desired_breed,
  desired_gender,
  pedigree_required,
  vaccination_required,
  price,
  is_price_negotiable,
  desired_age_range,
  breeding_experience,
  preferred_meeting_location,
  description,
}: PartnerDetailsProps) {
  return (
    <div className="space-y-6">
      {/* User's Dog Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Информации за миленичето</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dog_breed && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Раса</span>
                <span className="font-medium">{dog_breed}</span>
              </div>
            )}

            {dog_age !== undefined && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Возраст</span>
                <span className="font-medium">{dog_age} месеци</span>
              </div>
            )}

            {dog_gender && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Пол</span>
                <span className="font-medium">{dog_gender === "male" ? "Машко" : "Женско"}</span>
              </div>
            )}

            {dog_pedigree !== undefined && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Педигре</span>
                <span className="flex items-center font-medium">
                  {dog_pedigree ? <Check className="h-4 w-4 text-green-500 mr-1" /> : <X className="h-4 w-4 text-red-500 mr-1" />}
                  {dog_pedigree ? "Да" : "Не"}
                </span>
              </div>
            )}

            {dog_vaccinated !== undefined && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Вакцинирано</span>
                <span className="flex items-center font-medium">
                  {dog_vaccinated ? <Check className="h-4 w-4 text-green-500 mr-1" /> : <X className="h-4 w-4 text-red-500 mr-1" />}
                  {dog_vaccinated ? "Да" : "Не"}
                </span>
              </div>
            )}
          </div>

          {dog_description && (
            <div className="mt-4">
              <span className="text-sm text-muted-foreground block mb-1">Опис на миленичето</span>
              <p className="text-sm">{dog_description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Partner Requirements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Барања за партнер</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {desired_breed && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Посакувана раса</span>
                <span className="font-medium">{desired_breed}</span>
              </div>
            )}

            {desired_gender && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Посакуван пол</span>
                <span className="font-medium">{desired_gender === "male" ? "Машко" : "Женско"}</span>
              </div>
            )}

            {pedigree_required !== undefined && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Потребен педигре</span>
                <span className="flex items-center font-medium">
                  {pedigree_required ? <Check className="h-4 w-4 text-green-500 mr-1" /> : <X className="h-4 w-4 text-red-500 mr-1" />}
                  {pedigree_required ? "Да" : "Не"}
                </span>
              </div>
            )}

            {vaccination_required !== undefined && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Потребни вакцини</span>
                <span className="flex items-center font-medium">
                  {vaccination_required ? <Check className="h-4 w-4 text-green-500 mr-1" /> : <X className="h-4 w-4 text-red-500 mr-1" />}
                  {vaccination_required ? "Да" : "Не"}
                </span>
              </div>
            )}

            {(price !== undefined || is_price_negotiable) && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Цена</span>
                <span className="font-medium">{is_price_negotiable ? "По договор" : `${price?.toLocaleString()} ден`}</span>
              </div>
            )}

            {desired_age_range && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Посакувана возраст</span>
                <span className="font-medium">
                  {desired_age_range.min} - {desired_age_range.max} месеци
                </span>
              </div>
            )}
          </div>

          {/* Additional Information */}
          {(breeding_experience || preferred_meeting_location) && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Дополнителни информации</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {breeding_experience && (
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-sm font-medium block">Искуство со парење</span>
                      <span className="text-sm">{breeding_experience}</span>
                    </div>
                  </div>
                )}

                {preferred_meeting_location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-sm font-medium block">Локација за средба</span>
                      <span className="text-sm">{preferred_meeting_location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {description && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Опис на барањето</h3>
              <p className="text-sm whitespace-pre-line">{description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
