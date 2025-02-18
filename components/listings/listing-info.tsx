"use client";

import {Heart} from "lucide-react";
import {useRouter} from "next/navigation";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {formatPrice} from "@/lib/utils";

interface ListingInfoProps {
  id: string;
  breed: string | null;
  price: number | null;
  location: string;
}

export default function ListingInfo({id, breed, price, location}: ListingInfoProps) {
  const router = useRouter();

  const handleContact = () => {
    router.push(`/messages/new?listing=${id}`);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground mb-2">{location}</p>
        {breed && (
          <Link href={`/listings?breed=${encodeURIComponent(breed)}`} className="text-3xl font-bold hover:text-primary transition-colors">
            {breed}
          </Link>
        )}
        {price && <p className="text-2xl font-semibold">{formatPrice(price)}</p>}
      </div>

      <div className="flex gap-4">
        <Button className="flex-1 text-md py-6" onClick={handleContact}>
          Испрати порака
        </Button>
        <Button variant="outline" size="icon" className="h-[52px] w-[52px]">
          <Heart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
