"use client";

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Search} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
import type {Database} from "@/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const {data} = await supabase.from("categories").select("*").order("id");
      setCategories(data || []);
      setIsLoading(false);
    }

    fetchCategories();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("search", searchQuery);
    }
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (location) {
      params.set("location", location);
    }

    router.push(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/listings?category=${slug}`);
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-muted">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('/blob.svg')] bg-cover bg-center"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-black space-y-8">
          {/* Main Title */}
          <h1 className="text-5xl font-medium mb-4 font-rubik">Пронајди го твоето милениче</h1>
          <p className="text-xl mb-8 font-rubik">во најголемиот и најдобриот бар за животни во Македонија!</p>

          {/* Search Form */}
          <div className="bg-white rounded-xl p-2 shadow-lg max-w-5xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Животно, вид или раса"
                className="w-full h-12 border-0 bg-gray-50 rounded-lg focus:ring-0 text-gray-900 placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full h-12 border-0 bg-gray-50 rounded-lg focus:ring-0 text-gray-900 placeholder:text-gray-500">
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
                className="w-full h-12 border-0 bg-gray-50 rounded-lg focus:ring-0 text-gray-900 placeholder:text-gray-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch} className="h-12 px-8 bg-primary hover:bg-primary/90 font-medium rounded-lg">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Category Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {!isLoading &&
              categories
                .slice(0, 3)
                .map((category) => (
                  <CategoryLink
                    key={category.id}
                    icon={getCategoryIcon(category.slug)}
                    label={category.name}
                    onClick={() => handleCategoryClick(category.slug)}
                  />
                ))}
            <CategoryLink icon="🐾" label="Сите животни" onClick={() => router.push("/listings")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryLink({icon, label, onClick}: {icon: string; label: string; onClick: () => void}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-white shadow-lg hover:shadow-xl hover:bg-white text-black px-6 py-3 rounded-full transition-colors">
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function getCategoryIcon(slug: string): string {
  const iconMap: Record<string, string> = {
    dog: "🐕",
    cat: "🐈",
    horse: "🐎",
    bird: "🦜",
    fish: "🐠",
    reptile: "🦎",
    smallpet: "🐰",
    farm: "🐄",
  };
  return iconMap[slug] || "🐾";
}
