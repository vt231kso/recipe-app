import HeaderTop from "@/components/HeaderTop";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Suspense } from "react";
import Providers from "@/components/Providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie — Твоя затишна книга рецептів",
  description: "Діліться власними рецептами та знаходьте натхнення для нових кулінарних звершень.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
    <body className="bg-[#FCFBF7] text-gray-900 antialiased min-h-screen flex flex-col">
    <Providers>
      <header className="sticky top-0 z-50 shadow-sm bg-white">
        <Suspense fallback={<div className="h-[60px] bg-white animate-pulse" />}>
          <HeaderTop />
        </Suspense>
        <Navbar />
      </header>

      <main className="flex-1">
        {children}
      </main>
    </Providers>
    </body>
    </html>
  );
}
