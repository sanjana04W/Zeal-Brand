import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "@/components/layout/RootLayoutClient";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeal Brand | Graphic Tees & Streetwear Sri Lanka",
  description: "Shop the latest graphic tees, oversized fits, and premium streetwear from Zeal Brand. Islandwide Cash on Delivery available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
