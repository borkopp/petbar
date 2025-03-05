"use client";

import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Heart, List, Menu, MessageSquare, Plus, User} from "lucide-react";
import {useUnreadMessages} from "@/lib/context/unread-messages-context";
import {LogoutButton} from "./logout-button";

interface NavbarProps {
  user: {
    id: string;
    email?: string;
    user_metadata: {
      avatar_url?: string;
      full_name?: string;
    };
  } | null;
}

export function Navbar({user}: NavbarProps) {
  const {unreadCount} = useUnreadMessages();

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 font-normal">
            {user ? (
              <>
                <Link href="/listings">
                  <Button size="sm" variant="ghost">
                    <List className="h-5 w-5" />
                    Пазар
                  </Button>
                </Link>
                <Link href="/find-partner">
                  <Button size="sm" variant="ghost">
                    <Heart className="h-5 w-5" />
                    Пронајди партнер
                  </Button>
                </Link>
                <Link href="/create-listing">
                  <Button size="sm" variant="ghost">
                    <Plus className="h-5 w-5" />
                    Нов оглас
                  </Button>
                </Link>
                <Link href="/create-partner-listing">
                  <Button size="sm" variant="ghost">
                    <Heart className="h-5 w-5" />
                    Нов оглас за партнер
                  </Button>
                </Link>
                <Link href="/chat" className="relative">
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href="/profile">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Мој профил
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile?tab=listings">
                      <DropdownMenuItem>
                        <List className="mr-2 h-4 w-4" />
                        Мои огласи
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <form action="/auth/signout" method="post">
                      <DropdownMenuItem className="text-destructive" asChild>
                        <button type="submit" className="w-full">
                          Одјави се
                        </button>
                      </DropdownMenuItem>
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Најава</Button>
                </Link>
                <Link href="/register">
                  <Button>Регистрација</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <>
                <Link href="/chat" className="relative">
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Мени</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {user ? (
                    <>
                      <Link href="/listings">
                        <Button variant="ghost" className="w-full justify-start">
                          <List className="mr-2 h-5 w-5" />
                          Пазар
                        </Button>
                      </Link>
                      <Link href="/find-partner">
                        <Button variant="ghost" className="w-full justify-start">
                          <Heart className="mr-2 h-5 w-5" />
                          Пронајди партнер
                        </Button>
                      </Link>
                      <Link href="/create-listing">
                        <Button variant="ghost" className="w-full justify-start">
                          <Plus className="mr-2 h-5 w-5" />
                          Нов оглас
                        </Button>
                      </Link>
                      <Link href="/create-partner-listing">
                        <Button variant="ghost" className="w-full justify-start">
                          <Heart className="mr-2 h-5 w-5" />
                          Нов оглас за партнер
                        </Button>
                      </Link>
                      <div className="h-px bg-border" />
                      <Link href="/profile">
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="mr-2 h-5 w-5" />
                          Мој профил
                        </Button>
                      </Link>
                      <Link href="/profile?tab=listings">
                        <Button variant="ghost" className="w-full justify-start">
                          <List className="mr-2 h-5 w-5" />
                          Мои огласи
                        </Button>
                      </Link>
                      <div className="h-px bg-border" />
                      <LogoutButton />
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" className="w-full">
                          Најава
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full">Регистрација</Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
