"use client";

import {format} from "date-fns";
import {Clock, Star} from "lucide-react";
import Link from "next/link";

import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface SellerCardProps {
  seller: {
    id: string;
    username: string;
    avatar_url: string | null;
    created_at: string;
    rating: number | null;
  };
  responseTime: string;
  responseRate: number;
}

export default function SellerCard({seller, responseRate}: SellerCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={seller.avatar_url || undefined} />
            <AvatarFallback>{seller.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${seller.id}`} className="font-medium hover:underline">
              {seller.username}
            </Link>
            <p className="text-sm text-muted-foreground">Член од {format(new Date(seller.created_at), "MM.yyyy")}</p>
            {seller.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{seller.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>1 час</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{responseRate}%</span>
          <span>Стапка на одговор</span>
        </div>
      </div>
    </Card>
  );
}
