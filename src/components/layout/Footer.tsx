export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-sm">
              VotoSeguro 2026
            </p>
            <p className="text-xs mt-0.5">
              Plataforma educativa para las Elecciones Generales del Perú
            </p>
          </div>

          <div className="text-center text-xs">
            <p className="text-yellow-400 font-semibold mb-1">⚠ Aviso Legal</p>
            <p className="max-w-sm">
              Este simulador es una herramienta educativa. No es una cédula oficial.
              La cédula oficial es emitida exclusivamente por la{" "}
              <a
                href="https://www.onpe.gob.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-200 underline"
              >
                ONPE
              </a>
              .
            </p>
          </div>

          <div className="text-center md:text-right text-xs">
            <p>Fuentes oficiales:</p>
            <div className="flex gap-3 mt-1 justify-center md:justify-end">
              <a
                href="https://www.onpe.gob.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-200"
              >
                ONPE
              </a>
              <a
                href="https://portal.jne.gob.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-200"
              >
                JNE
              </a>
            </div>
            <p className="mt-2">© {currentYear} VotoSeguro Perú</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
