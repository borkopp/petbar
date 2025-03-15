"use client";

import * as React from "react";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {createClient} from "@/lib/supabase/client";
import {normalizeForSearch} from "@/lib/utils/transliteration";

type LocationComboboxProps = {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function LocationCombobox({value, onChange, className}: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [locations, setLocations] = React.useState<{id: number; name: string}[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const fetchLocations = async () => {
      const supabase = createClient();
      const {data} = await supabase.from("locations").select("id, name").order("name");
      if (data) {
        setLocations(data);
      }
    };

    fetchLocations();
  }, []);

  // Filter locations based on search query, supporting both Latin and Cyrillic
  const filteredLocations = React.useMemo(() => {
    if (!searchQuery) return locations;

    const normalizedSearchTerms = normalizeForSearch(searchQuery);

    return locations.filter((location) => {
      // Get normalized versions of the location name
      const normalizedLocationNames = normalizeForSearch(location.name);

      // Check if any normalized search term matches any normalized location name
      return normalizedSearchTerms.some((searchTerm) => normalizedLocationNames.some((locationName) => locationName.includes(searchTerm)));
    });
  }, [locations, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between font-normal", className)}>
          {value ? locations.find((location) => location.name === value)?.name : "Изберете локација"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Пребарајте локација..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandEmpty>Не е пронајдена локација.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {filteredLocations.map((location) => (
              <CommandItem
                key={location.id}
                value={location.name}
                onSelect={(currentValue) => {
                  onChange?.(currentValue);
                  setOpen(false);
                  setSearchQuery("");
                }}>
                <Check className={cn("mr-2 h-4 w-4", value === location.name ? "opacity-100" : "opacity-0")} />
                {location.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
