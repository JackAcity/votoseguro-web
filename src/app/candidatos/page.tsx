import type { Metadata } from "next";
import Link from "next/link";
import { getCandidatosPorCargo, getDepartamentos } from "@/lib/candidatos-service";
import { PartidoAccordion } from "@/components/candidatos/PartidoAccordion";
import type { TipoCargo } from "@/lib/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://votoseguro-web.vercel.app";

export const metadata: Metadata = {
  title: "Candidatos 2026 — Elecciones Generales Perú",
  description:
    "Conoce a los candidatos de las Elecciones Generales 2026: fórmulas presidenciales, senadores, diputados y parlamento andino. Datos del JNE.",
  alternates: {
    canonical: `${APP_URL}/candidatos`,
  },
  openGraph: {
    title: "Candidatos Elecciones 2026 — VotoSeguro Perú",
    description:
      "Explora los candidatos por partido: foto, posición en lista y enlace a la hoja de vida oficial JNE.",
    url: `${APP_URL}/candidatos`,
  },
};

// ── Configuración de tabs ──────────────────────────────────────────────────────

type TabId = "FORMULA_PRESIDENCIAL" | "SENADOR_NACIONAL" | "SENADOR_REGIONAL" | "DIPUTADO" | "PARLAMENTO_ANDINO";

const TABS: { id: TabId; label: string; short: string; esRegional: boolean }[] = [
  { id: "FORMULA_PRESIDENCIAL", label: "Fórmula Presidencial", short: "Presidente", esRegional: false },
  { id: "SENADOR_NACIONAL",     label: "Senadores Nacionales", short: "Sen. Nac.",  esRegional: false },
  { id: "SENADOR_REGIONAL",     label: "Senadores Regionales", short: "Sen. Reg.",  esRegional: true  },
  { id: "DIPUTADO",             label: "Diputados",            short: "Diputados",  esRegional: true  },
  { id: "PARLAMENTO_ANDINO",    label: "Parlamento Andino",    short: "P. Andino",  esRegional: false },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function CandidatosPage({
  searchParams,
}: {
  searchParams: Promise<{ cargo?: string; dep?: string }>;
}) {
  const { cargo: cargoParam, dep: depParam } = await searchParams;

  // Cargo activo — default fórmula presidencial
  const cargoActivo: TabId =
    (TABS.find((t) => t.id === cargoParam)?.id) ?? "FORMULA_PRESIDENCIAL";
  const tabActivo = TABS.find((t) => t.id === cargoActivo)!;

  // Departamento
  const departamentos = getDepartamentos();
  const depActivo = depParam?.toUpperCase().trim() || (tabActivo.esRegional ? departamentos[0] : undefined);

  // Candidatos del cargo activo
  const listas = getCandidatosPorCargo(cargoActivo as TipoCargo, depActivo);
  const esFormula = cargoActivo === "FORMULA_PRESIDENCIAL";

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-red-800 to-red-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="text-white/60 hover:text-white text-xs transition-colors">
              Inicio
            </Link>
            <span className="text-white/40 text-xs">/</span>
            <span className="text-white/80 text-xs">Candidatos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight mt-2">
            Candidatos <span className="text-yellow-300">2026</span>
          </h1>
          <p className="text-white/70 text-sm mt-1 max-w-xl">
            Conoce a todos los candidatos por partido político. Datos oficiales del JNE.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Link
              href="/simulador"
              className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              🗳️ Simular mi voto
            </Link>
            <a
              href="https://votoinformado.jne.gob.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/60 hover:text-white/90 underline transition-colors"
            >
              Portal JNE ↗
            </a>
          </div>
        </div>
      </div>

      {/* ── Tabs de cargo ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const isActive = tab.id === cargoActivo;
              const href = tab.esRegional
                ? `/candidatos?cargo=${tab.id}${depActivo ? `&dep=${encodeURIComponent(depActivo)}` : ""}`
                : `/candidatos?cargo=${tab.id}`;
              return (
                <Link
                  key={tab.id}
                  href={href}
                  className={`
                    shrink-0 px-3 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors
                    ${isActive
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.short}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Selector de departamento (solo para tabs regionales) ────────────── */}
      {tabActivo.esRegional && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-3">
            <label htmlFor="dep-select" className="text-xs font-bold text-gray-600 shrink-0">
              📍 Departamento:
            </label>
            <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
              {departamentos.map((dep) => {
                const isActiveDep = dep === depActivo;
                return (
                  <Link
                    key={dep}
                    href={`/candidatos?cargo=${cargoActivo}&dep=${encodeURIComponent(dep)}`}
                    className={`
                      text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full transition-colors
                      ${isActiveDep
                        ? "bg-red-700 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }
                    `}
                  >
                    {dep}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Contenido principal ─────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Aviso legal */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5 flex items-start gap-2">
          <span className="text-blue-500 shrink-0 mt-0.5">ℹ️</span>
          <p className="text-[10px] sm:text-xs text-blue-700 leading-relaxed">
            Datos tomados del{" "}
            <a href="https://portal.jne.gob.pe" target="_blank" rel="noopener noreferrer" className="underline font-bold">
              portal oficial del JNE
            </a>
            . Para ver la hoja de vida completa haz clic en <strong>Ver HV →</strong> junto a cada candidato.
            Los datos pueden variar si el JNE realiza cambios tras la inscripción.
          </p>
        </div>

        {/* Estado vacío — cargo regional sin departamento */}
        {tabActivo.esRegional && !depActivo && (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">📍</p>
            <p className="text-sm font-bold text-gray-500">
              Selecciona un departamento para ver los candidatos
            </p>
          </div>
        )}

        {/* Estado vacío — no hay candidatos */}
        {(!tabActivo.esRegional || depActivo) && listas.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-sm font-bold text-gray-500">
              No se encontraron candidatos para esta selección.
            </p>
          </div>
        )}

        {/* Grid de partidos */}
        {(!tabActivo.esRegional || depActivo) && listas.length > 0 && (
          <div className="space-y-3">
            {listas.map((lista) => (
              <PartidoAccordion
                key={lista.id}
                lista={lista}
                esFormula={esFormula}
              />
            ))}
          </div>
        )}

        {/* Fuente */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-[10px] text-gray-400">
            Fuente: Portal JNE —{" "}
            <a
              href="https://votoinformado.jne.gob.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              votoinformado.jne.gob.pe
            </a>
            {" "}· Proceso EG 2026
          </p>
        </div>
      </div>
    </main>
  );
}
