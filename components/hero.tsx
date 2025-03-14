"use client";

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {Database} from "@/database.types";
import {SearchBar} from "@/components/search-bar";
import Image from "next/image";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export function Hero() {
  const router = useRouter();
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

  const handleCategoryClick = (slug: string) => {
    router.push(`/listings?category=${slug}`);
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-muted">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <picture>
          <source srcSet="/hero4.webp" type="image/webp" />
          <Image src="/hero4.jpg" alt="Hero background" fill priority sizes="100vw" quality={80} className="object-cover object-center" />
        </picture>
      </div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white space-y-8">
          {/* Main Title */}
          <h1 className="text-5xl font-bold mb-1 font-rubik">Пронајди го твоето милениче</h1>
          <p className="text-xl mb-4 font-rubik">во најголемиот и најдобриот бар за животни во Македонија!</p>

          {/* Search Form */}
          <SearchBar variant="hero" />

          {/* Category Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {!isLoading &&
              categories
                .slice(0, 2)
                .map((category) => (
                  <CategoryLink
                    key={category.id}
                    icon={getCategoryIcon(category.slug)}
                    label={category.name}
                    onClick={() => handleCategoryClick(category.slug)}
                  />
                ))}
            <CategoryLink icon="🐾" label="Сите животни" onClick={() => router.push("/listings")} />
            <CategoryLink icon="💖" label="Пронајди партнер" onClick={() => router.push("/find-partner")} />
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
