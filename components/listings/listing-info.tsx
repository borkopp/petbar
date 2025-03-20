"use client";

import {useRouter} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import BookmarkButton from "@/components/listings/bookmark-button";

interface ListingInfoProps {
  id: string;
  breed: string | null;
  price: number | null;
  location: string;
  sellerId: string;
}

export default function ListingInfo({id, breed, price, location, sellerId}: ListingInfoProps) {
  const router = useRouter();

  const handleContact = () => {
    router.push(`/chat/${sellerId}?listing=${id}`);
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
        {price !== null && <p className="text-2xl font-semibold">{price === 0 ? "За вдомување" : `${price.toLocaleString()} ден`}</p>}
      </div>

      <div className="flex gap-4">
        <Button className="flex-1 text-md py-6" onClick={handleContact}>
          Испрати порака
        </Button>
        <BookmarkButton listingId={id} />
      </div>
    </div>
  );
}
