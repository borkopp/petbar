import Link from "next/link";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {createClient} from "@/lib/supabase/server";
import {LogoutButton} from "@/components/logout-button";
import {User2} from "lucide-react";
import {Plus} from "lucide-react";

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-8 md:px-12 lg:px-16">
        <nav className="flex h-16 items-center justify-between font-rubik">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/dogbar-v2.png" alt="dogbar.mk" width={75} height={75} className="h-12 w-auto" />
            <span className="text-3xl font-medium font-fredoka">dogbar.mk</span>
          </Link>

          <div className="flex items-center gap-2">
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
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Најави се</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Регистрирај се</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
