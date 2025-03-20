"use client";

import {useRouter} from "next/navigation";
import {SearchBar} from "@/components/search-bar";
import Image from "next/image";

// Static categories data
const categories = [
  {id: 1, name: "Кучиња", slug: "dog"},
  {id: 2, name: "Мачиња", slug: "cat"},
  {id: 3, name: "Коњи", slug: "horse"},
  {id: 4, name: "Птици", slug: "bird"},
  {id: 5, name: "Риби", slug: "fish"},
  {id: 6, name: "Рептили", slug: "reptile"},
  {id: 7, name: "Мали миленичиња", slug: "smallpet"},
  {id: 8, name: "Фармски животни", slug: "farm"},
];

export function Hero() {
  const router = useRouter();

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
            {categories.slice(0, 2).map((category) => (
              <CategoryLink
                key={category.id}
                iconSrc={getCategoryIconSrc(category.slug)}
                label={category.name}
                onClick={() => handleCategoryClick(category.slug)}
              />
            ))}
            <CategoryLink iconSrc="/icons/pets-hero.svg" label="Сите животни" onClick={() => router.push("/listings")} />
            <CategoryLink iconSrc="/icons/love-hero.svg" label="Пронајди партнер" onClick={() => router.push("/find-partner")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryLink({iconSrc, label, onClick}: {iconSrc: string; label: string; onClick: () => void}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-white shadow-lg hover:shadow-xl hover:bg-white text-black px-6 py-3 rounded-full transition-colors">
      <div className="relative w-8 h-8">
        <Image src={iconSrc} alt={label} width={32} height={32} className="object-contain" />
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function getCategoryIconSrc(slug: string): string {
  const iconMap: Record<string, string> = {
    dog: "/icons/dog-hero.svg",
    cat: "/icons/cat-hero.svg",
    horse: "/icons/horse-hero.svg",
    bird: "/icons/bird-hero.svg",
    fish: "/icons/fish-hero.svg",
    reptile: "/icons/reptile-hero.svg",
    smallpet: "/icons/rabbit-hero.svg",
    farm: "/icons/farm-hero.svg",
  };
  return iconMap[slug] || "/pets-hero.svg";
}
