import Link from "next/link";
import {Button} from "@/components/ui/button";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <Image src="/dogbar-logo.png" alt="DogBar" width={50} height={50} />
            <span className="text-3xl font-medium font-fredoka">dogbar.mk</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/marketplace" className="text-gray-600 hover:text-primary text-lg font-semibold">
              Пазар
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary text-lg font-semibold">
              Најави се
            </Link>
            <Button className="text-base font-semibold">Објави оглас</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
