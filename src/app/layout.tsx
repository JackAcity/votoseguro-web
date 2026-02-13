import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Voto Seguro 2026 — Simulador de Cédula Electoral Perú",
  description:
    "Simula tu voto para las Elecciones Generales del Perú 2026. Aprende a votar correctamente, entiende el voto preferencial y conoce las reglas de la ONPE. Herramienta educativa gratuita.",
  keywords: [
    "elecciones peru 2026",
    "cedula de sufragio",
    "voto preferencial",
    "simulador voto",
    "ONPE",
    "JNE",
    "elecciones generales",
  ],
  openGraph: {
    title: "Voto Seguro 2026 — Aprende a votar correctamente",
    description: "Simulador educativo de cédula de sufragio para las Elecciones Generales del Perú 2026",
    type: "website",
    locale: "es_PE",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-PE" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
