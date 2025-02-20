import type {Metadata} from "next";
import {Rubik} from "next/font/google";
import {Fredoka} from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/navbar";
import {Toaster} from "sonner";
import {cn} from "@/lib/utils";
import {Suspense} from "react";
import {LoadingScreen} from "@/components/ui/loading-screen";
import {InitialLoader} from "@/components/initial-loader";
import {Analytics} from "@vercel/analytics/react";
import {Footer} from "@/components/footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mk">
      <body className={cn("min-h-screen bg-background font-sans antialiased", rubik.variable, fredoka.variable)}>
        <InitialLoader />
        <Suspense fallback={<LoadingScreen />}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="bottom-right" />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
