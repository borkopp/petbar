import {Hero} from "../components/hero";
import {NewestListings} from "@/components/home/newest-listings";
import {PartnerListings} from "@/components/home/partner-listings";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Hero />
      <NewestListings />
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[600px] overflow-hidden">
        <picture>
          <source srcSet="/banner.webp" type="image/webp" />
          <Image src="/banner.png" alt="dog-banner" fill priority quality={90} sizes="100vw" className="object-cover object-left-center" />
        </picture>
      </div>
      <PartnerListings />
    </main>
  );
}
