import * as React from "react";
import {Check, ChevronsUpDown, Search} from "lucide-react";
import {cn} from "@/lib/utils";
import {createClient} from "@/lib/supabase/client";
import {latinToCyrillicText, cyrillicToLatinText} from "@/lib/utils/transliteration";

import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";

interface LocationComboboxProps {
  value?: string;
  onChange: (value: string) => void;
}

export function LocationCombobox({value, onChange}: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [locations, setLocations] = React.useState<{id: number; name: string}[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    async function fetchLocations() {
      const supabase = createClient();
      const {data} = await supabase.from("locations").select("id, name").order("name");
      setLocations(data || []);
      setLoading(false);
    }

    fetchLocations();
  }, []);

  // Filter locations based on search query with transliteration support
  const filteredLocations = React.useMemo(() => {
    if (!searchQuery) return locations;

    const query = searchQuery.toLowerCase();
    const cyrillicQuery = latinToCyrillicText(query);
    const latinQuery = cyrillicToLatinText(query);

    return locations.filter((location) => {
      const name = location.name.toLowerCase();

      // Check if the location name contains any version of the query
      return name.includes(query) || name.includes(cyrillicQuery) || name.includes(latinQuery);
    });
  }, [locations, searchQuery]);

  // Handle input change separately from the Command component
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value || "Изберете локација..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command filter={() => 1}>
          {" "}
          {/* Disable built-in filtering */}
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Пребарајте локација..."
              className="h-9 w-full bg-transparent"
              value={searchQuery}
              onValueChange={handleInputChange}
            />
          </div>
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Се вчитува...</div>
            ) : (
              <CommandGroup>
                {filteredLocations.length === 0 ? (
                  <CommandEmpty>Не е пронајдена локација.</CommandEmpty>
                ) : (
                  filteredLocations.map((location) => (
                    <CommandItem
                      key={location.id}
                      value={location.name}
                      onSelect={(currentValue) => {
                        onChange(currentValue);
                        setOpen(false);
                      }}>
                      <Check className={cn("mr-2 h-4 w-4", value === location.name ? "opacity-100" : "opacity-0")} />
                      {location.name}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            )}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
