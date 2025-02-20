import * as React from "react";
import {Dog, Cat, House, Bird, Fish, Turtle, Rabbit, Egg, Check, ChevronsUpDown, Search} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {breeds} from "@/lib/breeds";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";

interface CategoryCardProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isSelected: boolean;
}

const CategoryCard = ({icon, label, onClick, isSelected}: CategoryCardProps) => (
  <Button
    variant="outline"
    className={cn(
      "flex h-32 w-full flex-col items-center justify-center gap-2 p-6 transition-all hover:border-primary",
      isSelected && "border-2 border-primary bg-primary/5"
    )}
    onClick={onClick}>
    <div className="text-3xl text-muted-foreground">{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </Button>
);

interface CategorySelectionProps {
  onComplete: (data: {category: string; subcategory: string; breed: string}) => void;
}

export function CategorySelection({onComplete}: CategorySelectionProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [selectedBreed, setSelectedBreed] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const categories = [
    {id: "dog", label: "Куче", icon: <Dog className="h-10 w-10" />},
    {id: "cat", label: "Мачка", icon: <Cat className="h-10 w-10" />},
    {id: "horse", label: "Коњ", icon: <House className="h-10 w-10" />},
    {id: "bird", label: "Птица", icon: <Bird className="h-10 w-10" />},
    {id: "fish", label: "Риба", icon: <Fish className="h-10 w-10" />},
    {id: "reptile", label: "Влекач", icon: <Turtle className="h-10 w-10" />},
    {id: "smallpet", label: "Мал Миленик", icon: <Rabbit className="h-10 w-10" />},
    {id: "farm", label: "Фарма", icon: <Egg className="h-10 w-10" />},
  ];

  const filteredBreeds = React.useMemo(() => {
    if (!selectedCategory || selectedCategory !== "dog") return [];

    return Object.entries(breeds).flatMap(([subcategory, breedList]) =>
      breedList
        .filter((breed) => breed.toLowerCase().includes(search.toLowerCase()))
        .map((breed) => ({
          subcategory,
          breed,
        }))
    );
  }, [selectedCategory, search]);

  const handleBreedSelect = React.useCallback(
    (breed: string, subcategory: string) => {
      setSelectedBreed(breed);
      setOpen(false);
      onComplete({
        category: selectedCategory,
        subcategory: subcategory,
        breed: breed,
      });
    },
    [onComplete, selectedCategory]
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Изберете категорија</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              icon={category.icon}
              label={category.label}
              onClick={() => setSelectedCategory(category.id)}
              isSelected={selectedCategory === category.id}
            />
          ))}
        </div>
      </div>

      {selectedCategory === "dog" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Пребарајте раса</h3>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                {selectedBreed ? selectedBreed : "Изберете раса..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Пребарајте раса..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 border-0"
                />
              </div>
              <ScrollArea className="h-[300px]">
                {filteredBreeds.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Не е пронајдена раса.</div>
                ) : (
                  <div className="p-1">
                    {filteredBreeds.map(({breed, subcategory}) => (
                      <div
                        key={breed}
                        onClick={() => handleBreedSelect(breed, subcategory)}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground",
                          selectedBreed === breed && "bg-accent text-accent-foreground"
                        )}>
                        <Check className={cn("mr-2 h-4 w-4", selectedBreed === breed ? "opacity-100" : "opacity-0")} />
                        {breed}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
