"use client";

import * as React from "react";
import Image from "next/image";
import {ChevronLeft, ChevronRight, X, Expand} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";

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
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const showPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
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

          {/* Fullscreen Button */}
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white" onClick={() => setIsFullscreen(true)}>
            <Expand className="h-5 w-5" />
          </Button>

          {/* Mobile Dots Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn("w-2 h-2 rounded-full transition-colors", currentIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/75")}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Desktop Thumbnails */}
        {images.length > 1 && (
          <div className="hidden md:flex gap-2 overflow-x-auto pb-2">
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

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => setIsFullscreen(false)}>
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button variant="ghost" size="icon" className="absolute left-4 text-white hover:bg-white/10" onClick={showPrevious}>
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-4 text-white hover:bg-white/10" onClick={showNext}>
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <motion.div
              key={currentIndex}
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.9}}
              transition={{type: "spring", duration: 0.3}}
              className="relative h-full max-h-[90vh] w-full max-w-6xl">
              <Image
                src={images[currentIndex].url}
                alt="Pet listing image"
                fill
                className="object-contain"
                sizes="(max-width: 1536px) 100vw, 1536px"
                priority
              />
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
