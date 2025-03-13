"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

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
    <div className="w-40">
      <Select value={searchParams.get("sort") || "newest"} onValueChange={handleSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Сортирај" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Најнови</SelectItem>
          <SelectItem value="oldest">Најстари</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
