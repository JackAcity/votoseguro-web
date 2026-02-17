import type { Metadata } from "next";
import { CedulaSimulador } from "@/components/cedula/CedulaSimulador";
import { SelectorDepartamento } from "@/components/cedula/SelectorDepartamento";
import { getDatosSimulador } from "@/lib/candidatos-service";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://votoseguro-web.vercel.app";

export const metadata: Metadata = {
  title: "Simulador de Cédula",
  description:
    "Practica tu voto para las Elecciones Generales 2026. Simula la cédula con 5 columnas: Presidencial, Senadores Nacionales, Senadores Regionales, Diputados y Parlamento Andino.",
  alternates: {
    canonical: `${APP_URL}/simulador`,
  },
  openGraph: {
    title: "Simulador de Cédula Electoral — Voto Seguro 2026",
    description:
      "Practica las 5 columnas de la cédula: Presidencial, Senadores, Diputados y Parlamento Andino. Gratis y sin registro.",
    url: `${APP_URL}/simulador`,
  },
};

// Revalidar cada hora — los datos de candidatos no cambian frecuentemente
export const revalidate = 3600;

export default async function SimuladorPage({
  searchParams,
}: {
  searchParams: Promise<{ dep?: string }>;
}) {
  const { dep } = await searchParams;

  // Fetch server-side — datos reales de Supabase
  const datos = await getDatosSimulador(dep);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header de página */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-3">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-700 text-xs font-bold uppercase tracking-wide">
            Simulador Educativo — Elecciones Generales 2026
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
          Cédula de Sufragio
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          Práctica con los candidatos reales del JNE para el{" "}
          <strong className="text-gray-700">12 de abril de 2026</strong>.
          Selecciona un partido en cada columna y verifica si tu voto es válido.
        </p>
      </div>

      {/* Pasos rápidos */}
      <div className="flex items-center justify-center gap-0 mb-5 max-w-2xl mx-auto overflow-x-auto px-2">
        {[
          { paso: "1", texto: "Elige tu departamento", icono: "📍" },
          { paso: "2", texto: "Selecciona partido en cada columna", icono: "🗳️" },
          { paso: "3", texto: "Candidatos preferidos (opcional)", icono: "⭐" },
          { paso: "4", texto: "Verifica tu voto", icono: "✅" },
        ].map((item, i, arr) => (
          <div key={item.paso} className="flex items-center shrink-0">
            <div className="flex flex-col items-center text-center px-2">
              <div className="w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-black mb-1 shadow-sm">
                {item.paso}
              </div>
              <div className="text-[10px] text-gray-500 leading-tight max-w-[70px]">
                {item.texto}
              </div>
            </div>
            {i < arr.length - 1 && (
              <div className="w-6 h-px bg-gray-300 shrink-0 mb-4" />
            )}
          </div>
        ))}
      </div>

      {/* Selector de departamento */}
      <SelectorDepartamento departamentoActual={dep} />

      {/* Aviso si no hay departamento seleccionado */}
      {!dep && (
        <div className="max-w-3xl mx-auto mb-4">
          <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
            <span className="text-base shrink-0">💡</span>
            <span>
              Selecciona tu departamento para ver los candidatos de{" "}
              <strong>Senadores Regionales</strong> y <strong>Diputados</strong> de tu circunscripción.
            </span>
          </div>
        </div>
      )}

      {/* Simulador principal */}
      <CedulaSimulador datos={datos} />

      {/* Info sobre valla electoral */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-3xl mx-auto">
        <h3 className="font-bold text-blue-800 mb-2 text-sm flex items-center gap-1.5">
          <span>📊</span> ¿Qué es la valla electoral?
        </h3>
        <p className="text-xs text-blue-700 leading-relaxed">
          Un partido debe obtener <strong>al menos el 5%</strong> de votos válidos a nivel
          nacional para ingresar al Congreso. Las alianzas necesitan un 1% adicional por
          cada partido integrante. Además, deben elegir <strong>mínimo 7 diputados</strong> o{" "}
          <strong>3 senadores</strong>. Si no superan la valla, pierden su inscripción como partido.
        </p>
      </div>

      {/* Nota ONPE */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-gray-400">
          Los datos de candidatos son referenciales y provienen del portal oficial del JNE.
          La cédula oficial es diseñada y distribuida exclusivamente por la ONPE.{" "}
          <a
            href="https://www.onpe.gob.pe"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            onpe.gob.pe
          </a>
        </p>
      </div>
    </div>
  );
}
