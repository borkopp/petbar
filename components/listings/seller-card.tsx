"use client";

import {format} from "date-fns";
import Link from "next/link";

import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface SellerCardProps {
  seller: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    created_at: string;
    rating: number | null;
  };
  responseTime: string;
  responseRate: number;
}

export default function SellerCard({seller}: SellerCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={seller.avatar_url || undefined} />
            <AvatarFallback>{seller.full_name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${seller.id}`} className="font-medium hover:underline">
              {seller.full_name}
            </Link>
            <p className="text-sm text-muted-foreground">Член од {format(new Date(seller.created_at), "MM.yyyy")}</p>
            {/* {seller.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">{seller.rating.toFixed(1)}</span>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </Card>
  );
}
