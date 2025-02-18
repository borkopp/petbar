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
      <nav className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/dogbar-v2.png" alt="DogBar" width={75} height={75} />
          <span className="text-4xl font-medium font-fredoka">dogbar.mk</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/create-listing">
                  <Plus className="mr-2 h-4 w-4" />
                  Креирај Оглас
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/profile">
                  <User2 className="mr-2 h-4 w-4" />
                  Мој Профил
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
    </header>
  );
}
