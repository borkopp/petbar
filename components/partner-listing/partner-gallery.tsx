"use client";

import {useState} from "react";
import Image from "next/image";
import {ChevronLeft, ChevronRight, Expand} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";

interface PartnerGalleryProps {
  images: {url: string}[];
}

export default function PartnerGallery({images}: PartnerGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Default image if no images are provided
  const defaultImage = "/images/partner-placeholder.jpg";
  const hasImages = images.length > 0;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFullscreenPrevious = () => {
    setFullscreenIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleFullscreenNext = () => {
    setFullscreenIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullscreenOpen(true);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={hasImages ? images[currentIndex].url : defaultImage}
          alt="Partner listing image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />

        {/* Fullscreen button */}
        {hasImages && (
          <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                onClick={() => openFullscreen(currentIndex)}>
                <Expand className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen-lg w-[90vw] h-[90vh] p-0 bg-black">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image src={images[fullscreenIndex].url} alt="Partner listing image fullscreen" fill sizes="90vw" className="object-contain" />

                {/* Fullscreen navigation */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                  onClick={handleFullscreenPrevious}>
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                  onClick={handleFullscreenNext}>
                  <ChevronRight className="h-8 w-8" />
                </Button>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {fullscreenIndex + 1} / {images.length}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Navigation arrows (only if there are multiple images) */}
        {hasImages && images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
              onClick={handlePrevious}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
              onClick={handleNext}>
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {hasImages && images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasImages && images.length > 1 && (
        <div className="flex mt-2 gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2",
                index === currentIndex ? "border-pink-500" : "border-transparent"
              )}
              onClick={() => setCurrentIndex(index)}>
              <Image src={image.url} alt={`Thumbnail ${index + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
