import Link from "next/link";
import {Button} from "@/components/ui/button";
import Image from "next/image";
export function Navbar() {
  return (
    <nav className="border-b bg-white fixed top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary flex items-center gap-3">
            <Image src="/dogbar-v2.png" alt="DogBar" width={75} height={75} />
            <span className="text-4xl font-medium font-fredoka">dogbar.mk</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/marketplace"
              className="relative hover:text-primary text-md font-semibold transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              Пазар
            </Link>
            <Link
              href="/marketplace"
              className="relative  hover:text-primary text-md font-semibold transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              Пронајди партнер
            </Link>
            {/* Login and Ad Post */}
            <Link href="/login" className="text-gray-600 hover:text-primary text-md font-semibold">
              <Button variant={"outline"} className="text-base font-semibold">
                Најави се
              </Button>
            </Link>
            <Link href="/signup" className="text-gray-600 hover:text-primary text-md font-semibold">
              <Button className="text-base font-semibold">Објави оглас</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
