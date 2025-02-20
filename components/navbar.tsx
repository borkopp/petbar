import Link from "next/link";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {createClient} from "@/lib/supabase/server";
import {LogoutButton} from "@/components/logout-button";
import {Heart, List, User2, Plus, Menu, UserPlus, User} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator";

async function getUser() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  return user;
}

export async function Navbar() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="px-4 md:px-8 lg:px-16">
        <nav className="flex h-16 items-center justify-between font-rubik">
          <Link href="/" className="flex items-center space-x-2 md:space-x-4">
            <Image src="/dogbar-transparent.png" alt="petbar.mk" width={75} height={75} className="h-8 w-auto md:h-12" />
            <div className="flex flex-col">
              <span className="text-xl md:text-3xl font-semibold text-primary font-fredoka">petbar.mk</span>
              <span className="hidden md:inline text-xs text-muted-foreground font-rubik">Вашиот бар за животни</span>
            </div>
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <Link href="/listings">
                <List className="h-4 w-4" />
                Огласи
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <Link href="/listings">
                <Heart className="h-4 w-4" />
                Пронајди партнер
              </Link>
            </Button>
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                  <Link href="/create-listing">
                    <Plus className="h-4 w-4" />
                    Нов оглас
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5 md:hidden" />
                      <User2 className="hidden h-5 w-5 md:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full cursor-pointer">
                        <User2 className="h-4 w-4" />
                        Мој профил
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=listings" className="w-full cursor-pointer">
                        <List className="h-4 w-4" />
                        Мои огласи
                      </Link>
                    </DropdownMenuItem>
                    <Separator className="my-2" />
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link href="/listings" className="w-full cursor-pointer">
                        Огласи
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link href="/listings" className="w-full cursor-pointer">
                        Пронајди партнер
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link href="/create-listing" className="w-full cursor-pointer">
                        Нов оглас
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5 md:hidden" />
                    <User2 className="hidden h-5 w-5 md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="w-full cursor-pointer">
                      <User className="h-4 w-4" />
                      Најави се
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="w-full cursor-pointer">
                      <UserPlus className="h-4 w-4" />
                      Регистрирај се
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
