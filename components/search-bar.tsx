"use client";

import * as React from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Search} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
import type {Database} from "@/database.types";
import {cn} from "@/lib/utils";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface SearchBarProps {
  variant?: "hero" | "listings" | "partners";
  className?: string;
}

interface SearchValues {
  searchQuery: string;
  selectedCategory: string;
  location: string;
}

function SearchContent({onSearch, initialValues}: {onSearch: (values: SearchValues) => void; initialValues: SearchValues}) {
  const [searchQuery, setSearchQuery] = React.useState(initialValues.searchQuery || "");
  const [selectedCategory, setSelectedCategory] = React.useState(initialValues.selectedCategory || "");
  const [location, setLocation] = React.useState(initialValues.location || "");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const {data} = await supabase.from("categories").select("*").order("id");
      setCategories(data || []);
      setIsLoading(false);
    }

    fetchCategories();
  }, []);

  const handleSubmit = () => {
    onSearch({searchQuery, selectedCategory, location});
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Пребарување</label>
        <Input placeholder="Животно, вид или раса" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Категорија</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Категорија" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Сите категории</SelectItem>
            {!isLoading &&
              categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Локација</label>
        <Input placeholder="Град, област или регион" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full" />
      </div>

      <Button onClick={handleSubmit} className="w-full">
        <Search className="mr-2 h-4 w-4" />
        Пребарај
      </Button>
    </div>
  );
}

export function SearchBar({variant = "hero", className}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get("category") || "");
  const [location, setLocation] = React.useState(searchParams.get("location") || "");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const {data} = await supabase.from("categories").select("*").order("id");
      setCategories(data || []);
      setIsLoading(false);
    }

    fetchCategories();
  }, []);

  const handleSearch = (values?: {searchQuery: string; selectedCategory: string; location: string}) => {
    const params = new URLSearchParams(searchParams.toString());
    const query = values?.searchQuery ?? searchQuery;
    const category = values?.selectedCategory ?? selectedCategory;
    const loc = values?.location ?? location;

    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    if (loc) {
      params.set("location", loc);
    } else {
      params.delete("location");
    }

    // Determine which page to route to based on variant
    const targetPage = variant === "partners" ? "/find-partner" : "/listings";

    router.push(`${targetPage}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const isHeroVariant = variant === "hero";
  const isMobileView = !isHeroVariant;

  return (
    <>
      {/* Desktop Search Bar */}
      <div
        className={cn(
          "hidden md:flex flex-col md:flex-row gap-2",
          isHeroVariant ? "bg-white rounded-xl p-2 shadow-lg max-w-5xl mx-auto" : "max-w-4xl",
          className
        )}>
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Животно, вид или раса"
            className={cn(
              "w-full h-12 focus:ring-0 text-gray-900 placeholder:text-gray-500",
              isHeroVariant ? "border-0 bg-gray-50 rounded-lg" : "border"
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger
              className={cn(
                "w-full h-12 text-gray-900 placeholder:text-gray-500",
                isHeroVariant ? "border-0 bg-gray-50 rounded-lg focus:ring-0" : "border"
              )}>
              <SelectValue placeholder="Категорија" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Сите категории</SelectItem>
              {!isLoading &&
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Град, област или регион"
            className={cn(
              "w-full h-12 focus:ring-0 text-gray-900 placeholder:text-gray-500",
              isHeroVariant ? "border-0 bg-gray-50 rounded-lg" : "border"
            )}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          onClick={() => handleSearch()}
          className={cn("h-12 px-8 font-medium", isHeroVariant ? "bg-primary hover:bg-primary/90 rounded-lg" : "")}>
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Search Bar */}
      {isMobileView ? (
        <div className="md:hidden flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Пребарај..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh]">
              <SheetHeader>
                <SheetTitle>Пребарување</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <SearchContent
                  onSearch={handleSearch}
                  initialValues={{
                    searchQuery,
                    selectedCategory,
                    location,
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : null}
    </>
  );
}
