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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://votoseguro-web.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Voto Seguro 2026 — Simulador de Cédula Electoral Perú",
    template: "%s | Voto Seguro 2026",
  },
  description:
    "Simula tu voto para las Elecciones Generales del Perú 2026. Aprende a votar correctamente, entiende el voto preferencial y conoce las reglas de la ONPE. Herramienta educativa gratuita.",
  keywords: [
    "elecciones peru 2026",
    "cedula de sufragio",
    "voto preferencial peru",
    "simulador voto peru",
    "ONPE 2026",
    "JNE elecciones",
    "elecciones generales peru",
    "como votar peru",
    "cedula electoral peru",
    "voto valido peru",
  ],
  authors: [{ name: "Voto Seguro 2026" }],
  creator: "Voto Seguro 2026",
  publisher: "Voto Seguro 2026",
  category: "education",
  openGraph: {
    title: "Voto Seguro 2026 — Aprende a votar correctamente",
    description:
      "Simulador educativo gratuito de cédula de sufragio para las Elecciones Generales del Perú — 13 de abril de 2026. 5 columnas: Presidencial, Senadores, Diputados y Parlamento Andino.",
    type: "website",
    locale: "es_PE",
    url: APP_URL,
    siteName: "Voto Seguro 2026",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Voto Seguro 2026 — Simulador de cédula electoral",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voto Seguro 2026 — Simula tu voto",
    description: "Herramienta educativa gratuita para las Elecciones Generales del Perú 2026",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: APP_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Agregar cuando tengan Google Search Console
    // google: "XXXXXXXXXXXXXXXX",
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
