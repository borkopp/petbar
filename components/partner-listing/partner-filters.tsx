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
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Filter, X} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

function FiltersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = React.useState([0, 100000]); // 0-100,000 MKD
  const [ageRange, setAgeRange] = React.useState([0, 180]); // 0-15 years in months
  const [breeds, setBreeds] = React.useState<{id: number; name: string}[]>([]);
  const [locations, setLocations] = React.useState<{id: number; name: string}[]>([]);
  const [categories, setCategories] = React.useState<{id: number; name: string; slug: string}[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingLocations, setLoadingLocations] = React.useState(true);
  const [loadingCategories, setLoadingCategories] = React.useState(true);

  // Fetch categories on mount
  React.useEffect(() => {
    async function fetchCategories() {
      setLoadingCategories(true);
      const supabase = createClient();
      const {data} = await supabase.from("categories").select("id, name, slug").order("id");
      setCategories(data || []);
      setLoadingCategories(false);
    }

    fetchCategories();
  }, []);

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

  // Fetch breeds when category changes
  React.useEffect(() => {
    async function fetchBreeds() {
      const category = searchParams.get("category");
      if (category) {
        setLoading(true);
        const supabase = createClient();

        // First get the category ID
        const {data: categoryData} = await supabase.from("categories").select("id").eq("slug", category).single();

        if (categoryData) {
          // Then fetch breeds for this category
          const {data: breedsData} = await supabase.from("breeds").select("id, name").eq("category_id", categoryData.id).order("name");

          setBreeds(breedsData || []);
        } else {
          setBreeds([]);
        }
        setLoading(false);
      } else {
        setBreeds([]);
      }
    }

    fetchBreeds();
  }, [searchParams.get("category")]);

  // Count active filters
  const activeFilters = [
    "category",
    "desired_breed",
    "desired_gender",
    "location",
    "pedigree_required",
    "vaccination_required",
    "price",
    "age",
  ].filter((param) => searchParams.get(param));

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
        `/find-partner?${createQueryString({
          [key]: value,
          desired_breed: null,
        })}`,
        {scroll: false}
      );
    } else {
      router.push(`/find-partner?${createQueryString({[key]: value})}`, {
        scroll: false,
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Филтри</h2>
          {activeFilterCount > 0 && <Badge className="bg-secondary text-secondary-foreground">{activeFilterCount}</Badge>}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => router.push("/find-partner")}>
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
              {loadingCategories ? (
                <div className="text-sm text-muted-foreground">Се вчитува...</div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.slug}
                      checked={searchParams.get("category") === category.slug}
                      onCheckedChange={() => handleFilterChange("category", category.slug)}
                      className="border-secondary/50 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                    <Label htmlFor={category.slug}>{category.name}</Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {searchParams.get("category") && breeds.length > 0 && (
          <AccordionItem value="breed">
            <AccordionTrigger>Раса</AccordionTrigger>
            <AccordionContent>
              <Select value={searchParams.get("desired_breed") || ""} onValueChange={(value) => handleFilterChange("desired_breed", value)}>
                <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus:ring-transparent focus:outline-none select-none border-secondary/30 focus:border-secondary/50">
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

        <AccordionItem value="gender">
          <AccordionTrigger>Пол на миленичето</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              defaultValue={searchParams.get("desired_gender") || ""}
              onValueChange={(value) => handleFilterChange("desired_gender", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" className="border-secondary/50 text-secondary" />
                <Label htmlFor="male">Машки</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" className="border-secondary/50 text-secondary" />
                <Label htmlFor="female">Женски</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Локација</AccordionTrigger>
          <AccordionContent>
            <Select value={searchParams.get("location") || ""} onValueChange={(value) => handleFilterChange("location", value)}>
              <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus:ring-transparent focus:outline-none select-none border-secondary/30 focus:border-secondary/50">
                <SelectValue placeholder="Изберете локација" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {loadingLocations ? (
                  <SelectItem value="">Се вчитува...</SelectItem>
                ) : (
                  locations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
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
                color="secondary"
                className="my-2"
                onValueChange={setPriceRange}
                onValueCommit={() => handleFilterChange("price", `${priceRange[0]}-${priceRange[1]}`)}
              />
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  placeholder="Мин"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-24 border-secondary/30 focus-visible:ring-secondary/30"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Макс"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-24 border-secondary/30 focus-visible:ring-secondary/30"
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
                color="secondary"
                onValueChange={setAgeRange}
                onValueCommit={() => handleFilterChange("age", `${ageRange[0]}-${ageRange[1]}`)}
                className="my-2"
              />
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  placeholder="Мин"
                  value={ageRange[0]}
                  onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
                  className="w-24 border-secondary/30 focus-visible:ring-secondary/30"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Макс"
                  value={ageRange[1]}
                  onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
                  className="w-24 border-secondary/30 focus-visible:ring-secondary/30"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="requirements">
          <AccordionTrigger>Дополнителни барања</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pedigree"
                  checked={searchParams.get("pedigree_required") === "true"}
                  onCheckedChange={(checked) => handleFilterChange("pedigree_required", checked ? "true" : null)}
                  className="border-secondary/50 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                />
                <Label htmlFor="pedigree">Со педигре</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vaccinated"
                  checked={searchParams.get("vaccination_required") === "true"}
                  onCheckedChange={(checked) => handleFilterChange("vaccination_required", checked ? "true" : null)}
                  className="border-secondary/50 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
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

export default function PartnerFilters() {
  return (
    <>
      {/* Desktop filters */}
      <div className="hidden md:block">
        <FiltersContent />
      </div>

      {/* Mobile filters */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full border-secondary/30 text-secondary hover:bg-secondary/5 hover:text-secondary">
              <Filter className="mr-2 h-4 w-4" />
              Филтри
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Филтри</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
