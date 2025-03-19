"use client";

import {format} from "date-fns";
import Link from "next/link";

import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { User } from "lucide-react";

interface SellerCardProps {
  seller: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    created_at: string;
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
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${seller.id}`} className="font-medium hover:underline">
              {seller.full_name}
            </Link>
            <p className="text-sm text-muted-foreground">Член од {format(new Date(seller.created_at), "MM.yyyy")}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
