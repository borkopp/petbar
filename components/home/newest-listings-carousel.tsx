"use client";

import {useState, useCallback, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import {ChevronLeft, ChevronRight, Syringe, Award, Mars, Venus} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import useEmblaCarousel from "embla-carousel-react";

interface ListingImage {
  id: string;
  url: string;
  is_primary: boolean | null;
}

interface Listing {
  id: string;
  title: string;
  price: number | null;
  location: string | null;
  category: string;
  listingType: string;
  gender: string | null;
  vaccinated: boolean | null;
  pedigree: boolean | null;
  createdAt: string | null;
  images: ListingImage[];
  description: string;
}

interface NewestListingsCarouselProps {
  listings: Listing[];
}

export function NewestListingsCarousel({listings}: NewestListingsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": {slidesToScroll: 2},
      "(min-width: 1024px)": {slidesToScroll: 4},
    },
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      <TooltipProvider>
        {/* Navigation Buttons */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 md:-left-6">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-background shadow-md"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}>
            <ChevronLeft className="h-5 w-5 text-primary" />
            <span className="sr-only">Previous</span>
          </Button>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 md:-right-6">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-background shadow-md"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}>
            <ChevronRight className="h-5 w-5 text-primary" />
            <span className="sr-only">Next</span>
          </Button>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 px-6">
            {listings.map((listing) => (
              <div key={listing.id} className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] md:flex-[0_0_calc(25%-18px)] min-w-0">
                <Link href={`/listings/${listing.id}`}>
                  <Card className="overflow-hidden group h-full transition-all hover:shadow-md border border-gray-200 rounded-xl">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={typeof listing.images[0] === "string" ? listing.images[0] : listing.images[0]?.url || "/placeholder.png"}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs font-medium">
                          {listing.category === "dog" ? "Куче" : listing.category === "cat" ? "Маче" : "Друго"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      {listing.location && <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">{listing.location}</div>}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-base line-clamp-1">{listing.title}</h3>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2 line-clamp-2">{listing.description}</div>

                      <div className="flex justify-between items-center mt-auto">
                        <div className="font-medium text-muted-foreground">{listing.price ? `${listing.price} ден.` : "По договор"}</div>
                        <div className="flex gap-1.5 items-center">
                          {listing.gender && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  {listing.gender === "male" ? (
                                    <Mars className="h-4 w-4 text-blue-500" />
                                  ) : (
                                    <Venus className="h-4 w-4 text-pink-500" />
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{listing.gender === "male" ? "Машко" : "Женско"}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {listing.vaccinated && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Syringe className="h-4 w-4 text-green-500" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Вакцинирано</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {listing.pedigree && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Award className="h-4 w-4 text-yellow-500" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Со педигре</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {scrollSnaps.length > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${selectedIndex === index ? "w-6 bg-primary" : "w-2 bg-gray-300"}`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </TooltipProvider>
    </div>
  );
}
