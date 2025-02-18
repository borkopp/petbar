import Link from "next/link";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {createClient} from "@/lib/supabase/server";
import {LogoutButton} from "@/components/logout-button";
import {Heart, List, User2} from "lucide-react";
import {Plus} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

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
      <div className="px-8 md:px-12 lg:px-16">
        <nav className="flex h-16 items-center justify-between font-rubik">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/dogbar-transparent.png" alt="dogbar.mk" width={75} height={75} className="h-12 w-auto" />
            <span className="text-3xl font-medium text-primary  font-fredoka">dogbar.mk</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="flex items-center gap-2">
              <Link href="/listings">
                <List className="h-4 w-4" />
                Огласи
              </Link>
            </Button>
            <Button asChild variant="ghost" className="flex items-center gap-2">
              <Link href="/listings">
                <Heart className="h-4 w-4" />
                Пронајди партнер
              </Link>
            </Button>
            {user ? (
              <>
                <Button asChild variant="ghost" className="flex items-center gap-2">
                  <Link href="/create-listing">
                    <Plus className="h-4 w-4" />
                    Нов оглас
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="flex items-center gap-2">
                  <Link href="/profile">
                    <User2 className="h-4 w-4" />
                    Мој профил
                  </Link>
                </Button>
                <LogoutButton />
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User2 className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="w-full cursor-pointer">
                      Најави се
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="w-full cursor-pointer">
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
