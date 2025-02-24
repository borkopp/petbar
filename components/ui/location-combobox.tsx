import * as React from "react";
import {Check, ChevronsUpDown, Search} from "lucide-react";
import {cn} from "@/lib/utils";
import {createClient} from "@/lib/supabase/client";

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

  React.useEffect(() => {
    async function fetchLocations() {
      const supabase = createClient();
      const {data} = await supabase.from("locations").select("id, name").order("name");
      setLocations(data || []);
      setLoading(false);
    }

    fetchLocations();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value || "Изберете локација..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Пребарајте локација..." className="h-9 w-full bg-transparent" />
          </div>
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Се вчитува...</div>
            ) : (
              <CommandGroup>
                {locations.length === 0 ? (
                  <CommandEmpty>Не е пронајдена локација.</CommandEmpty>
                ) : (
                  locations.map((location) => (
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
