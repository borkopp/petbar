import {Hero} from "../components/hero";
import {NewestListings} from "@/components/home/newest-listings";

export default function Home() {
  return (
    <main>
      <Hero />
      <NewestListings />
    </main>
  );
}
