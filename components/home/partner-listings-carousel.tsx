"use client";

import {useState, useCallback, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import {ChevronLeft, ChevronRight, Award, Shield, Mars, Venus} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import useEmblaCarousel from "embla-carousel-react";

interface PartnerImage {
  id: string;
  url: string;
  is_primary: boolean | null;
}

interface PartnerListing {
  id: string;
  title: string;
  description?: string;
  location: string | null;
  dogBreed?: string;
  dogAge?: number;
  dogGender?: string;
  dogPedigree?: boolean;
  dogVaccinated?: boolean;
  desiredBreed?: string;
  desiredGender: string;
  pedigreeRequired: boolean;
  vaccinationRequired: boolean;
  price?: number | null;
  isPriceNegotiable?: boolean;
  createdAt: string | null;
  images: PartnerImage[];
}

interface PartnerListingsCarouselProps {
  listings: PartnerListing[];
}

export function PartnerListingsCarousel({listings}: PartnerListingsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 640px)": {slidesToScroll: 1},
      "(min-width: 768px)": {slidesToScroll: 2},
      "(min-width: 1024px)": {slidesToScroll: 3},
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
    <div className="relative max-w-6xl mx-auto">
      <TooltipProvider>
        {/* Navigation Buttons - Hidden on small screens */}
        <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 z-10 md:-left-6">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-background shadow-md"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}>
            <ChevronLeft className="h-5 w-5 text-secondary" />
            <span className="sr-only">Previous</span>
          </Button>
        </div>

        <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 md:-right-6">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-background shadow-md"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}>
            <ChevronRight className="h-5 w-5 text-secondary" />
            <span className="sr-only">Next</span>
          </Button>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 sm:gap-4 md:gap-6 pl-4 pr-4 md:px-6">
            {listings.map((listing) => (
              <div key={listing.id} className="flex-[0_0_80%] sm:flex-[0_0_calc(50%-8px)] md:flex-[0_0_calc(33.333%-16px)] min-w-0">
                <Link href={`/find-partner/${listing.id}`}>
                  <Card className="overflow-hidden group h-full transition-all hover:shadow-md border border-gray-200 rounded-xl">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={typeof listing.images[0] === "string" ? listing.images[0] : listing.images[0]?.url || "/placeholder.png"}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs font-medium">
                          Партнер
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      {listing.location && <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">{listing.location}</div>}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{listing.title}</h3>
                      </div>

                      {listing.description && <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">{listing.description}</p>}

                      <div className="flex justify-between items-center mt-auto">
                        <div className="font-medium text-sm sm:text-base text-muted-foreground">
                          {listing.price ? `${listing.price} ден.` : listing.isPriceNegotiable ? "По договор" : ""}
                        </div>
                        <div className="flex gap-1.5 items-center">
                          {listing.desiredGender && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  {listing.desiredGender === "male" ? (
                                    <Mars className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
                                  ) : (
                                    <Venus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-pink-500" />
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Бара {listing.desiredGender === "male" ? "машки" : "женски"} партнер</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {listing.pedigreeRequired && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Бара со педигре</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {listing.vaccinationRequired && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Бара вакцинирано</p>
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
          <div className="flex justify-center mt-4 md:mt-8 gap-1.5 md:gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 md:h-2 rounded-full transition-all ${
                  selectedIndex === index ? "w-5 md:w-6 bg-secondary" : "w-1.5 md:w-2 bg-gray-300"
                }`}
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
