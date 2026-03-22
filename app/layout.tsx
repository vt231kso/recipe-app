import HeaderTop from "@/components/Header";
import Navbar from "@/components/Navbar";
import "./globals.css";
import {Suspense} from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
    <body className="bg-[#FCFBF7] text-gray-900 antialiased">
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      <Suspense fallback={<div className="h-[60px] bg-white animate-pulse" />}>
      <HeaderTop />
      </Suspense>
      <Navbar />
    </header>

    <div className="min-h-screen">
      {children}
    </div>
    </body>
    </html>
  );
}
