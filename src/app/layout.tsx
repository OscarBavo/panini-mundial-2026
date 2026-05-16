import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mis Estampas Repetidas – Mundial 2026",
  description: "Intercambia tus estampas repetidas del álbum Panini FIFA World Cup 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <header className="bg-green-800 text-white shadow-lg sticky top-0 z-40">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold flex items-center gap-2 hover:text-green-200 transition-colors"
            >
              ⚽ Mis Estampas
            </Link>
            <div className="flex gap-1 text-sm font-medium">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                Disponibles
              </Link>
              <Link
                href="/subir"
                className="px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                Subir Estampa
              </Link>
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                Administrar
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-green-900 text-green-300 text-center text-xs py-3">
          FIFA World Cup 2026™ · Álbum Panini
        </footer>
      </body>
    </html>
  );
}
