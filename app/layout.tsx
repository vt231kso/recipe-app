import HeaderTop from "@/components/Header";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
    <body className="bg-[#FCFBF7] text-gray-900 antialiased">
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      <HeaderTop />
      <Navbar />
    </header>

    {/* Додаємо min-h-screen сюди, щоб футер (потім) був внизу */}
    <div className="min-h-screen">
      {children}
    </div>
    </body>
    </html>
  );
}
