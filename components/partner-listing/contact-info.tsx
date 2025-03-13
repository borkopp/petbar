"use client";

import {MapPin, Phone} from "lucide-react";

import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

interface ContactInfoProps {
  location: string;
  phone?: string;
}

export default function ContactInfo({location, phone}: ContactInfoProps) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-semibold text-lg">Контакт</h2>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span>{location}</span>
        </div>

        {phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <Button variant="link" className="h-auto p-0">
              {phone}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
