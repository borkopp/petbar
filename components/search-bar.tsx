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

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface SearchBarProps {
  variant?: "hero" | "listings";
  className?: string;
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

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    if (location) {
      params.set("location", location);
    } else {
      params.delete("location");
    }

    router.push(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const isHeroVariant = variant === "hero";

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-2",
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
              isHeroVariant ? "border-0 rounded-lg select-none bg-background focus:ring-0" : "border"
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
      <Button onClick={handleSearch} className={cn("h-12 px-8 font-medium", isHeroVariant ? "bg-primary hover:bg-primary/90 rounded-lg" : "")}>
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
}
