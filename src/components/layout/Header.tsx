import Link from "next/link";

export function Header() {
  return (
    <header className="bg-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[52px] py-1 gap-2">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:opacity-90 transition-opacity shrink-0 min-h-[44px]"
          >
            {/* Bandera Perú simplificada */}
            <div className="flex h-5 w-4 sm:h-6 sm:w-5 rounded-sm overflow-hidden shadow-sm shrink-0">
              <div className="w-1/3 bg-red-500" />
              <div className="w-1/3 bg-white" />
              <div className="w-1/3 bg-red-500" />
            </div>
            <span className="font-black text-base sm:text-lg tracking-tight whitespace-nowrap">
              VotoSeguro
              <span className="text-yellow-300 ml-1">2026</span>
            </span>
          </Link>

          {/* Navegación */}
          <nav className="flex items-center gap-1">
            {/* "Inicio" — oculto en pantallas muy pequeñas */}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                         hover:bg-red-600 transition-colors min-h-[44px]"
            >
              Inicio
            </Link>
            {/* Botón CTA — texto corto en móvil, largo en sm+ */}
            <Link
              href="/simulador"
              className="inline-flex items-center px-3 sm:px-4 py-2 rounded-md text-sm font-bold
                         bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors
                         min-h-[44px] whitespace-nowrap"
            >
              <span className="sm:hidden">🗳️ Simular</span>
              <span className="hidden sm:inline">🗳️ Simular mi voto</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
