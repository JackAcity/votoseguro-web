import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      {/* Franja decorativa superior */}
      <div className="flex h-1">
        <div className="flex-1 bg-red-700" />
        <div className="flex-1 bg-white/20" />
        <div className="flex-1 bg-red-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* Columna 1: Marca */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-5 w-4 rounded-sm overflow-hidden border border-white/10">
                <div className="w-1/3 bg-red-600" />
                <div className="w-1/3 bg-white/80" />
                <div className="w-1/3 bg-red-600" />
              </div>
              <p className="text-white font-black text-sm tracking-tight">
                VotoSeguro <span className="text-yellow-400">2026</span>
              </p>
            </div>
            <p className="text-xs leading-relaxed mb-3">
              Plataforma educativa gratuita para prepararte para las
              Elecciones Generales del Perú. Sin fines de lucro.
            </p>
            <Link
              href="/simulador"
              className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              🗳️ Ir al simulador
            </Link>
          </div>

          {/* Columna 2: Aviso legal */}
          <div>
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-2">
              ⚠ Aviso Legal
            </p>
            <p className="text-xs leading-relaxed">
              Este simulador es una herramienta <strong className="text-white">educativa e independiente</strong>.
              No está afiliado a la ONPE, JNE ni a ningún partido político.
              La cédula oficial es emitida exclusivamente por la{" "}
              <a
                href="https://www.onpe.gob.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-200 underline"
              >
                ONPE
              </a>
              . Los datos de candidatos provienen del portal público del{" "}
              <a
                href="https://portal.jne.gob.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-200 underline"
              >
                JNE
              </a>
              .
            </p>
          </div>

          {/* Columna 3: Info electoral */}
          <div>
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-2">
              Elecciones 2026
            </p>
            <ul className="text-xs space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-yellow-400 shrink-0">📅</span>
                <span>Domingo <strong className="text-white">13 de abril de 2026</strong></span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-yellow-400 shrink-0">🕗</span>
                <span>Horario: <strong className="text-white">8:00 AM – 4:00 PM</strong></span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-yellow-400 shrink-0">🪪</span>
                <span>Lleva tu DNI vigente el día de las elecciones</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-yellow-400 shrink-0">🏛️</span>
                <span>5 cargos en una sola cédula: Presidente, Senadores, Diputados y Parlamento Andino</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-3">
              <a href="https://www.onpe.gob.pe" target="_blank" rel="noopener noreferrer"
                className="text-[10px] bg-white/10 hover:bg-white/20 text-yellow-300 px-2 py-1 rounded transition-colors">
                ONPE
              </a>
              <a href="https://portal.jne.gob.pe" target="_blank" rel="noopener noreferrer"
                className="text-[10px] bg-white/10 hover:bg-white/20 text-yellow-300 px-2 py-1 rounded transition-colors">
                JNE
              </a>
              <a href="https://www.reniec.gob.pe" target="_blank" rel="noopener noreferrer"
                className="text-[10px] bg-white/10 hover:bg-white/20 text-yellow-300 px-2 py-1 rounded transition-colors">
                RENIEC
              </a>
            </div>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="border-t border-white/10 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px]">
          <p>© {currentYear} VotoSeguro Perú — Educación cívica gratuita</p>
          <p className="text-gray-600">
            Datos referenciales · No reemplaza las instrucciones oficiales de la ONPE
          </p>
        </div>
      </div>
    </footer>
  );
}
