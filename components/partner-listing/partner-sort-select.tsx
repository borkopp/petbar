"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ArrowUpDown} from "lucide-react";
import {motion} from "framer-motion";

export default function PartnerSortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    }

    return current.toString();
  };

  const handleSortChange = (value: string) => {
    router.push(`${pathname}?${createQueryString({sort: value})}`, {
      scroll: false,
    });
  };

  return (
    <Select value={searchParams.get("sort") || "newest"} onValueChange={handleSortChange}>
      <SelectTrigger className="w-auto flex items-center gap-2 focus:ring-0 focus:ring-offset-0">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Сортирај" />
      </SelectTrigger>
      <SelectContent>
        <motion.div initial={{opacity: 0, y: -5}} animate={{opacity: 1, y: 0}} transition={{duration: 0.2}}>
          <SelectItem value="newest" className="flex items-center">
            Најнови прво
          </SelectItem>
          <SelectItem value="oldest" className="flex items-center">
            Најстари прво
          </SelectItem>
          <SelectItem value="price-asc" className="flex items-center">
            Цена: најниска прво
          </SelectItem>
          <SelectItem value="price-desc" className="flex items-center">
            Цена: највисока прво
          </SelectItem>
        </motion.div>
      </SelectContent>
    </Select>
  );
}
