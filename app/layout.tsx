import type {Metadata} from "next";
import {Rubik} from "next/font/google";
import {Fredoka} from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  variable: "--font-rubik",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "dogbar.mk - Пазар за миленичина во Македонија",
  description: "Пазар за миленичина во Македонија",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${fredoka.variable} font-rubik antialiased`}>{children}</body>
    </html>
  );
}
