import Link from "next/link";
import {Facebook, Instagram, Mail} from "lucide-react";
import Image from "next/image";
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-8 py-6 md:px-12 lg:px-16">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="/dogbar-transparent.png" alt="petbar.mk" width={75} height={75} className="h-12 w-auto" />
              <div className="flex flex-col">
                <span className="text-xl md:text-3xl font-semibold font-fredoka">
                  <span className="text-primary">petbar</span>
                  <span className="text-secondary">.</span>
                  <span className="text-primary">mk</span>
                </span>
                <span className="text-xs text-muted-foreground font-rubik">Вашиот бар за животни</span>
              </div>
            </Link>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">Најдете го вашето ново милениче, или партнер за вашето милениче.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Навигација</h2>
              <ul className="text-muted-foreground">
                <li className="mb-2">
                  <Link href="/listings" className="hover:text-primary">
                    Огласи
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/find-partner" className="hover:text-primary">
                    Пронајди партнер
                  </Link>
                </li>
                <li>
                  <Link href="/create-listing" className="hover:text-primary">
                    Нов оглас
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Помош</h2>
              <ul className="text-muted-foreground">
                <li className="mb-2">
                  <Link href="/faq" className="hover:text-primary">
                    ЧПП
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/contact" className="hover:text-primary">
                    Контакт
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary">
                    За нас
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Правно</h2>
              <ul className="text-muted-foreground">
                <li className="mb-2">
                  <Link href="/privacy" className="hover:text-primary">
                    Приватност
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary">
                    Услови
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-border sm:mx-auto" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-muted-foreground sm:text-center">
            © {currentYear}{" "}
            <Link href="/" className="hover:text-primary">
              petbar.mk
            </Link>
            . Сите права се задржани.
          </span>
          <div className="mt-4 flex space-x-5 sm:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook страница</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram профил</span>
            </Link>
            <Link href="mailto:contact@petbar.mk" className="text-muted-foreground hover:text-primary">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Контакт е-пошта</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="waves h-48">
          <svg className="waves-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g>
              <use href="#wave" x="48" y="0" fill="hsl(32, 95%, 54%, 0.7)" />
            </g>
            <g>
              <use href="#wave" x="48" y="3" fill="hsl(32, 95%, 54%, 0.5)" />
            </g>
            <g>
              <use href="#wave" x="48" y="5" fill="hsl(32, 95%, 54%, 0.3)" />
            </g>
            <g>
              <use href="#wave" x="48" y="7" fill="hsl(32, 95%, 54%, 0.2)" />
            </g>
          </svg>
        </div>
      </div>
    </footer>
  );
}
