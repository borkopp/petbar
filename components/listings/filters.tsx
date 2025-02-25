"use client";

import * as React from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Slider} from "@/components/ui/slider";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {X} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function ListingsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = React.useState([0, 100000]); // 0-100,000 MKD
  const [ageRange, setAgeRange] = React.useState([0, 180]); // 0-15 years in months
  const [breeds, setBreeds] = React.useState<{id: number; name: string}[]>([]);
  const [locations, setLocations] = React.useState<{id: number; name: string}[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingLocations, setLoadingLocations] = React.useState(true);

  // Fetch locations on mount
  React.useEffect(() => {
    async function fetchLocations() {
      setLoadingLocations(true);
      const supabase = createClient();
      const {data} = await supabase.from("locations").select("id, name").order("name");
      setLocations(data || []);
      setLoadingLocations(false);
    }

    fetchLocations();
  }, []);

  // Fetch breeds when category is "dog"
  React.useEffect(() => {
    async function fetchBreeds() {
      if (searchParams.get("category") === "dog") {
        setLoading(true);
        const supabase = createClient();
        const {data} = await supabase.from("breeds").select("id, name").order("name");

        setBreeds(data || []);
        setLoading(false);
      } else {
        setBreeds([]);
      }
    }

    fetchBreeds();
  }, [searchParams.get("category")]);

  // Count active filters
  const activeFilters = ["type", "category", "breed", "price", "age", "gender", "location", "pedigree", "vaccinated"].filter((param) =>
    searchParams.get(param)
  );

  const activeFilterCount = activeFilters.length;

  const createQueryString = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    }

    return current.toString();
  };

  const handleFilterChange = (key: string, value: string | null) => {
    // If changing category, reset breed
    if (key === "category" && value !== "dog") {
      router.push(
        `/listings?${createQueryString({
          [key]: value,
          breed: null,
        })}`,
        {scroll: false}
      );
    } else {
      router.push(`/listings?${createQueryString({[key]: value})}`, {
        scroll: false,
      });
    }
  };

  const clearFilters = () => {
    router.push("/listings");
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Филтри</h2>
          {activeFilterCount > 0 && <Badge variant="secondary">{activeFilterCount}</Badge>}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Исчисти
          </Button>
        )}
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>Категорија</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="dog" checked={searchParams.get("category") === "dog"} onCheckedChange={() => handleFilterChange("category", "dog")} />
                <Label htmlFor="dog">Куче</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cat" checked={searchParams.get("category") === "cat"} onCheckedChange={() => handleFilterChange("category", "cat")} />
                <Label htmlFor="cat">Мачка</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bird"
                  checked={searchParams.get("category") === "bird"}
                  onCheckedChange={() => handleFilterChange("category", "bird")}
                />
                <Label htmlFor="bird">Птица</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={searchParams.get("category") === "other"}
                  onCheckedChange={() => handleFilterChange("category", "other")}
                />
                <Label htmlFor="other">Друго</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {searchParams.get("category") === "dog" && (
          <AccordionItem value="breed">
            <AccordionTrigger>Раса</AccordionTrigger>
            <AccordionContent>
              <Select value={searchParams.get("breed") || ""} onValueChange={(value) => handleFilterChange("breed", value)}>
                <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus:ring-transparent focus:outline-none select-none">
                  <SelectValue placeholder="Изберете раса" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="">Се вчитува...</SelectItem>
                  ) : (
                    breeds.map((breed) => (
                      <SelectItem key={breed.id} value={breed.name}>
                        {breed.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="type">
          <AccordionTrigger>Тип на Оглас</AccordionTrigger>
          <AccordionContent>
            <RadioGroup defaultValue={searchParams.get("type") || ""} onValueChange={(value) => handleFilterChange("type", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sale" id="sale" />
                <Label htmlFor="sale">Продажба</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adoption" id="adoption" />
                <Label htmlFor="adoption">Вдомување</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Цена (МКД)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={priceRange}
                max={100000}
                step={1000}
                onValueChange={setPriceRange}
                onValueCommit={() => handleFilterChange("price", `${priceRange[0]}-${priceRange[1]}`)}
              />
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  placeholder="Мин"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-24"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Макс"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-24"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="age">
          <AccordionTrigger>Возраст (месеци)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={ageRange}
                max={180}
                step={1}
                onValueChange={setAgeRange}
                onValueCommit={() => handleFilterChange("age", `${ageRange[0]}-${ageRange[1]}`)}
              />
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  placeholder="Мин"
                  value={ageRange[0]}
                  onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
                  className="w-24"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Макс"
                  value={ageRange[1]}
                  onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
                  className="w-24"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gender">
          <AccordionTrigger>Пол</AccordionTrigger>
          <AccordionContent>
            <RadioGroup defaultValue={searchParams.get("gender") || ""} onValueChange={(value) => handleFilterChange("gender", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Машки</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Женски</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Локација</AccordionTrigger>
          <AccordionContent>
            {loadingLocations ? (
              <div className="py-2 text-sm text-muted-foreground">Се вчитува...</div>
            ) : (
              <Select value={searchParams.get("location") || ""} onValueChange={(value) => handleFilterChange("location", value)}>
                <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus:ring-transparent focus:outline-none select-none">
                  <SelectValue placeholder="Изберете локација" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="other">
          <AccordionTrigger>Останато</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pedigree"
                  checked={searchParams.get("pedigree") === "true"}
                  onCheckedChange={(checked) => handleFilterChange("pedigree", checked ? "true" : null)}
                />
                <Label htmlFor="pedigree">Со педигре</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vaccinated"
                  checked={searchParams.get("vaccinated") === "true"}
                  onCheckedChange={(checked) => handleFilterChange("vaccinated", checked ? "true" : null)}
                />
                <Label htmlFor="vaccinated">Вакцинирано</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
