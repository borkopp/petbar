import * as React from "react";
import {motion} from "framer-motion";
import {useFormContext} from "react-hook-form";
import {createClient} from "@/lib/supabase/client";
import {Check, ChevronsUpDown, Search} from "lucide-react";
import {cn} from "@/lib/utils";

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

interface BreedSelectionProps {
  onNext: () => void;
}

export function BreedSelection({onNext}: BreedSelectionProps) {
  const form = useFormContext();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [breeds, setBreeds] = React.useState<{id: number; name: string}[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch breeds when component mounts
  React.useEffect(() => {
    async function fetchBreeds() {
      setLoading(true);
      const supabase = createClient();
      const {data} = await supabase.from("breeds").select("id, name").order("name");
      setBreeds(data || []);
      setLoading(false);
    }

    fetchBreeds();
  }, []);

  const filteredBreeds = React.useMemo(() => {
    return breeds.filter((breed) => breed.name.toLowerCase().includes(search.toLowerCase()));
  }, [breeds, search]);

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {y: 0, opacity: 1},
  };

  const handleNext = async () => {
    const isValid = await form.trigger("breed");
    if (isValid) {
      onNext();
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Изберете раса</CardTitle>
          <CardDescription>Изберете ја расата на вашето милениче</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="breed"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Раса</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                          {field.value ? field.value : "Изберете раса..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
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
                        {loading ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">Се вчитува...</div>
                        ) : filteredBreeds.length === 0 ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">Не е пронајдена раса.</div>
                        ) : (
                          <div className="p-1">
                            {filteredBreeds.map((breed) => (
                              <div
                                key={breed.id}
                                onClick={() => {
                                  field.onChange(breed.name);
                                  form.setValue("breed_id", breed.id);
                                  setOpen(false);
                                }}
                                className={cn(
                                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground",
                                  field.value === breed.name && "bg-accent text-accent-foreground"
                                )}>
                                <Check className={cn("mr-2 h-4 w-4", field.value === breed.name ? "opacity-100" : "opacity-0")} />
                                {breed.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </CardContent>
      </Card>
      <div className="flex justify-end pt-6">
        <Button type="button" onClick={handleNext}>
          Следно
        </Button>
      </div>
    </motion.div>
  );
}
