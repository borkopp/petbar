"use client";

import {format} from "date-fns";
import Link from "next/link";

import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import type {Database} from "@/database.types";

type User = Database["public"]["Tables"]["profiles"]["Row"];

interface OwnerCardProps {
  owner: User;
  responseTime?: string;
  responseRate?: number;
}

export default function OwnerCard({owner}: OwnerCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={owner.avatar_url || undefined} />
            <AvatarFallback>{owner.full_name?.[0].toUpperCase() || owner.username?.[0].toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${owner.id}`} className="font-medium hover:underline">
              {owner.full_name || owner.username}
            </Link>
            <p className="text-sm text-muted-foreground">Член од {format(new Date(owner.created_at || new Date()), "MM.yyyy")}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
