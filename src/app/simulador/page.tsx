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

export default async function SimuladorPage({
  searchParams,
}: {
  searchParams: Promise<{ dep?: string }>;
}) {
  const { dep } = await searchParams;

  // Datos estáticos en memoria — sin llamada de red
  const datos = getDatosSimulador(dep);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header de página */}
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
          Cédula de Sufragio
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Practica con los candidatos reales del JNE —{" "}
          <strong className="text-gray-700">12 de abril de 2026</strong>
        </p>
      </div>

      {/* Selector de departamento */}
      <SelectorDepartamento departamentoActual={dep} />

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
