"use client";

import {Shield, Award, Verified, Calendar, Mars, Venus, Dog, Palette, Weight, Syringe} from "lucide-react";

import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";

interface PetDetailsProps {
  age: number | null;
  gender: string | null;
  breed: string | null;
  color: string | null;
  weight: number | null;
  pedigree: boolean | null;
  vaccine: boolean | null;
  description: string | null;
}

export default function PetDetails({age, gender, breed, color, weight, pedigree, vaccine, description}: PetDetailsProps) {
  return (
    <Card className="p-6 space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span>Проверен одгледувач</span>
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Verified className="h-3 w-3" />
          <span>Проверен идентитет</span>
        </Badge>
        {pedigree && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            <span>Педигре</span>
          </Badge>
        )}
        {age !== null && age <= 1 && <Badge variant="secondary">Кученце</Badge>}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        {age !== null && (
          <div className="flex gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-[3px]" />
            <div>
              <p className="text-sm text-muted-foreground">Возраст</p>
              <p className="font-medium">
                {age} {age === 1 ? "месец" : "месеци"}
              </p>
            </div>
          </div>
        )}
        {gender && (
          <div className="flex gap-2">
            {gender === "male" ? (
              <Mars className="h-4 w-4 text-muted-foreground mt-[3px]" />
            ) : (
              <Venus className="h-4 w-4 text-muted-foreground mt-[3px]" />
            )}
            <div>
              <p className="text-sm text-muted-foreground">Пол</p>
              <p className="font-medium">{gender === "male" ? "Машко" : "Женско"}</p>
            </div>
          </div>
        )}
        {breed && (
          <div className="flex gap-2">
            <Dog className="h-4 w-4 text-muted-foreground mt-[3px]" />
            <div>
              <p className="text-sm text-muted-foreground">Раса</p>
              <p className="font-medium">{breed}</p>
            </div>
          </div>
        )}
        {color && (
          <div className="flex gap-2">
            <Palette className="h-4 w-4 text-muted-foreground mt-[3px]" />
            <div>
              <p className="text-sm text-muted-foreground">Боја</p>
              <p className="font-medium">{color}</p>
            </div>
          </div>
        )}
        {weight && (
          <div className="flex gap-2">
            <Weight className="h-4 w-4 text-muted-foreground mt-[3px]" />
            <div>
              <p className="text-sm text-muted-foreground">Тежина</p>
              <p className="font-medium">{weight} кг</p>
            </div>
          </div>
        )}
        {vaccine && (
          <div className="flex gap-2">
            <Syringe className="h-4 w-4 text-muted-foreground mt-[3px]" />
            <div>
              <p className="text-sm text-muted-foreground">Вакцинирано</p>
              <p className="font-medium">Да</p>
            </div>
          </div>
        )}
      </div>

      {description && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Опис</h3>
            <p className="text-muted-foreground whitespace-pre-line">{description}</p>
          </div>
        </>
      )}
    </Card>
  );
}
