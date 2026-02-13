import Link from "next/link";

export function Header() {
  return (
    <header className="bg-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-1.5">
              {/* Bandera Perú simplificada */}
              <div className="flex h-6 w-5 rounded-sm overflow-hidden shadow-sm">
                <div className="w-1/3 bg-red-600" />
                <div className="w-1/3 bg-white" />
                <div className="w-1/3 bg-red-600" />
              </div>
              <span className="font-black text-lg tracking-tight">
                VotoSeguro
                <span className="text-yellow-300 ml-1">2026</span>
              </span>
            </div>
          </Link>

          {/* Navegación */}
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/simulador"
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors font-bold"
            >
              Simular mi voto
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
