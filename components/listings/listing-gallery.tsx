"use client";

import * as React from "react";
import Image from "next/image";
import {ChevronLeft, ChevronRight} from "lucide-react";

import {Card} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

interface ListingGalleryProps {
  images: {
    id: string;
    url: string;
    is_primary: boolean | null;
  }[];
}

export default function ListingGallery({images}: ListingGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const showPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative aspect-[4/3] overflow-hidden">
        {images.length > 0 && <Image src={images[currentIndex].url} alt="Pet listing image" fill className="object-cover" priority />}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={showPrevious}>
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" onClick={showNext}>
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}
      </Card>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2",
                currentIndex === index ? "border-primary" : "border-transparent"
              )}>
              <Image src={image.url} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
