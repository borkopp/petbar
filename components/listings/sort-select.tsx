"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ArrowUpDown} from "lucide-react";
import {motion} from "framer-motion";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createSortUrl = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    return `?${params.toString()}`;
  };

  const handleValueChange = (value: string) => {
    router.push(createSortUrl(value));
  };

  return (
    <Select defaultValue={searchParams.get("sort") || "newest"} onValueChange={handleValueChange}>
      <SelectTrigger className="w-auto flex items-center gap-2 focus:ring-0 focus:ring-offset-0">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Подреди по" />
      </SelectTrigger>
      <SelectContent>
        <motion.div initial={{opacity: 0, y: -5}} animate={{opacity: 1, y: 0}} transition={{duration: 0.2}}>
          <SelectItem value="newest" className="flex items-center gap-2">
            Најнови прво
          </SelectItem>
          <SelectItem value="oldest" className="flex items-center gap-2">
            Најстари прво
          </SelectItem>
          <SelectItem value="price-asc" className="flex items-center gap-2">
            Цена: најниска прво
          </SelectItem>
          <SelectItem value="price-desc" className="flex items-center gap-2">
            Цена: највисока прво
          </SelectItem>
        </motion.div>
      </SelectContent>
    </Select>
  );
}
