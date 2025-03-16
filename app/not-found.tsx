import {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft, PawPrint} from "lucide-react";

export const metadata: Metadata = {
  title: "Страницата не е пронајдена | petbar.mk",
  description: "Страницата што ја барате не е пронајдена на petbar.mk",
};

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 min-h-[70vh] flex flex-col items-center justify-center font-rubik">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="relative h-52 mx-auto">
          <Image src="/icons/dog-button.svg" alt="Confused dog" fill priority />
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-medium text-primary">404</h1>
          <h2 className="text-3xl font-medium">Страницата не е пронајдена</h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Упс! Изгледа дека нашето куче ја закопало страницата што ја барате. Ајде да се вратиме назад.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              Назад кон почетна
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/listings">
              <PawPrint className="h-5 w-5" />
              Разгледај огласи
            </Link>
          </Button>
        </div>

        <div className="mt-12 flex justify-center space-x-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative w-8 h-8 opacity-70">
              <Image src="/paw-print.svg" alt="Paw print" fill className={`transform rotate-${Math.floor(Math.random() * 45)}deg`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
