import {Hero} from "../components/hero";
import {NewestListings} from "@/components/home/newest-listings";
import {PartnerListings} from "@/components/home/partner-listings";
import {PetFocusedSection} from "@/components/home/pet-focused-section";
import {FAQSection} from "@/components/home/faq-section";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Hero />
      <NewestListings />
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[600px] overflow-hidden mt-16 bg-gray-50">
        <picture>
          <source srcSet="/banner.webp" type="image/webp" />
          <Image src="/banner.png" alt="dog-banner" fill priority quality={90} sizes="100vw" className="object-contain" />
        </picture>
      </div>
      <PartnerListings />
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[600px] overflow-hidden mt-16 bg-gray-50">
        <picture>
          <source srcSet="/banner2.webp" type="image/webp" />
          <Image src="/banner2.png" alt="dog-banner-2" fill priority quality={90} sizes="100vw" className="object-contain" />
        </picture>
      </div>
      <PetFocusedSection />
      <FAQSection />
    </main>
  );
}
