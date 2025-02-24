import * as React from "react";
import {createClient} from "@/lib/supabase/client";
import {CategoryCard} from "@/components/ui/category-card";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategorySelectionProps {
  onComplete: (data: {category: string}) => void;
  onNext: () => void;
}

export function CategorySelection({onComplete, onNext}: CategorySelectionProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(true);

  // Fetch categories on mount
  React.useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const {data} = await supabase.from("categories").select("id, name, slug").order("id");

      setCategories(data || []);
      setLoadingCategories(false);
    }

    fetchCategories();
  }, []);

  // Map category slugs to their respective icon names
  const getIconForSlug = (slug: string) => {
    const iconMap: Record<string, string> = {
      dog: "dog",
      cat: "cat",
      horse: "horse",
      bird: "bird",
      fish: "fish",
      reptile: "reptile",
      smallpet: "rabbit",
      farm: "farm",
    };
    return iconMap[slug] || slug;
  };

  const handleNext = async () => {
    if (!selectedCategory) {
      toast.error("Изберете категорија", {
        description: "Ве молиме изберете категорија за да продолжите.",
      });
      return;
    }
    onNext();
  };

  if (loadingCategories) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <p className="text-muted-foreground">Се вчитува...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Изберете категорија</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              icon={getIconForSlug(category.slug)}
              label={category.name}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedCategory(category.slug);
                onComplete({
                  category: category.slug,
                });
              }}
              isSelected={selectedCategory === category.slug}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end pt-6">
        <Button type="button" onClick={handleNext}>
          Следно
        </Button>
      </div>
    </div>
  );
}
