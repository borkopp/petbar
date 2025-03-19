import type {Metadata} from "next";
import {Rubik} from "next/font/google";
import {Fredoka} from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/navbar";
import {Toaster} from "sonner";
import {cn} from "@/lib/utils";
import {Suspense} from "react";
import {LoadingScreen} from "@/components/ui/loading-screen";
import {Analytics} from "@vercel/analytics/react";
import {FooterWrapper} from "@/components/footer-wrapper";
import {createClient} from "@/lib/supabase/server";
import {UnreadMessagesProvider} from "@/lib/context/unread-messages-context";
import {AuthProvider} from "@/lib/context/auth-provider";
import {SpeedInsights} from "@vercel/speed-insights/next";

const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  variable: "--font-rubik",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "petbar.mk - Пазар за миленичина во Македонија",
  description: "Најдобриот пазар за миленичина во Македонија",
};

async function getUser() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  return user;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="mk" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preload" href="/hero4.webp" as="image" type="image/webp" />
        <link rel="preload" href="/hero4.jpg" as="image" type="image/jpeg" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", rubik.variable, fredoka.variable)}>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <UnreadMessagesProvider userId={user?.id}>
              <Navbar user={user} />
              <main className="flex-1">{children}</main>
              <FooterWrapper />
              <Toaster richColors position="bottom-right" />
              {/* <CookieConsent /> */}
            </UnreadMessagesProvider>
          </Suspense>
          <Analytics />
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
