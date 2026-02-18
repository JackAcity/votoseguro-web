import Link from "next/link";
import { CountdownElecciones } from "@/components/CountdownElecciones";

export function Header() {
  return (
    <header className="bg-red-700 text-white shadow-lg">
      {/* Barra superior con countdown */}
      <div className="bg-red-900 border-b border-red-800 py-1 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-red-300">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Elecciones Generales — Domingo 12 de abril de 2026
          </span>
          <CountdownElecciones compact />
        </div>
      </div>

      {/* Navegación principal */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[52px] py-1 gap-2">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0 min-h-[44px]"
          >
            {/* Bandera Perú */}
            <div className="flex h-6 w-5 sm:h-7 sm:w-6 rounded-sm overflow-hidden shadow-sm shrink-0 border border-white/20">
              <div className="w-1/3 bg-red-500" />
              <div className="w-1/3 bg-white" />
              <div className="w-1/3 bg-red-500" />
            </div>
            <div className="leading-none">
              <span className="font-black text-base sm:text-lg tracking-tight whitespace-nowrap block">
                VotoSeguro
                <span className="text-yellow-300 ml-1">2026</span>
              </span>
              <span className="text-[9px] text-red-300 hidden sm:block">
                Simulador oficial educativo
              </span>
            </div>
          </Link>

          {/* Navegación */}
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                         hover:bg-red-600 transition-colors min-h-[44px]"
            >
              Inicio
            </Link>
            <Link
              href="/guia"
              className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                         hover:bg-red-600 transition-colors min-h-[44px]"
            >
              Guía
            </Link>
            <Link
              href="/candidatos"
              className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                         hover:bg-red-600 transition-colors min-h-[44px]"
            >
              Candidatos
            </Link>
            <Link
              href="/simulador"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md text-sm font-bold
                         bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors
                         min-h-[44px] whitespace-nowrap shadow-sm"
            >
              <span className="text-base leading-none">🗳️</span>
              <span className="sm:hidden">Simular</span>
              <span className="hidden sm:inline">Simular mi voto</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
