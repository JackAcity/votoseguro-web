"use client";

import { useState } from "react";
import { ColumnaElectoral } from "./ColumnaElectoral";
import { ResultadoVoto } from "./ResultadoVoto";
import { ResumenVotoLateral } from "./ResumenVotoLateral";
import { TutorialOnboarding } from "./TutorialOnboarding";
import { useCedula } from "@/hooks/useCedula";
import { CONFIG_COLUMNAS } from "@/lib/cedula-logic";
import type { DatosSimulador, VotoCedula } from "@/lib/types";

type ColumnaKey = keyof Omit<VotoCedula, "formulaPresidencial">;

const TODAS_COLUMNAS: Array<{
  key: "formulaPresidencial" | ColumnaKey;
  configIdx: number;
  esFormula: boolean;
}> = [
  { key: "formulaPresidencial", configIdx: 0, esFormula: true },
  { key: "senadorNacional",     configIdx: 1, esFormula: false },
  { key: "senadorRegional",     configIdx: 2, esFormula: false },
  { key: "diputado",            configIdx: 3, esFormula: false },
  { key: "parlamentoAndino",    configIdx: 4, esFormula: false },
];

const TAB_LABELS: Record<string, { short: string; full: string; emoji: string }> = {
  formulaPresidencial: { short: "Presidencial",  full: "Fórmula Presidencial", emoji: "🏛️" },
  senadorNacional:     { short: "Sen. Nacional", full: "Senadores Nacionales", emoji: "🗳️" },
  senadorRegional:     { short: "Sen. Regional", full: "Senadores Regionales", emoji: "📍" },
  diputado:            { short: "Diputados",     full: "Diputados",            emoji: "🏛️" },
  parlamentoAndino:    { short: "P. Andino",     full: "Parlamento Andino",    emoji: "🌎" },
};

// Header colours per column
const HEADER_COLORS: Record<number, string> = {
  0: "bg-red-800",
  1: "bg-blue-900",
  2: "bg-green-900",
  3: "bg-purple-900",
  4: "bg-yellow-700",
};

interface Props {
  datos: DatosSimulador;
}

export function CedulaSimulador({ datos }: Props) {
  const DATOS = datos;

  const COLUMNA_DATOS: Record<ColumnaKey, typeof DATOS.senadoresNacionales> = {
    senadorNacional:  DATOS.senadoresNacionales,
    senadorRegional:  DATOS.senadoresRegionales,
    diputado:         DATOS.diputados,
    parlamentoAndino: DATOS.parlamentoAndino,
  };

  const {
    voto,
    resultado,
    seleccionarFormula,
    seleccionarLista,
    setPreferencial,
    resetear,
    validar,
  } = useCedula();

  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [columnaActiva, setColumnaActiva] = useState(0);

  const handleValidar = () => {
    validar();
    setMostrarResultado(true);
    setTimeout(() => {
      document.getElementById("resultado-voto")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleReintentar = () => {
    resetear();
    setMostrarResultado(false);
    setColumnaActiva(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tieneSeleccion = (key: string) => {
    if (key === "formulaPresidencial") return voto.formulaPresidencial !== undefined;
    return voto[key as ColumnaKey] !== undefined;
  };

  const columnasMarcadas = TODAS_COLUMNAS.filter((c) => tieneSeleccion(c.key)).length;
  const progreso = (columnasMarcadas / TODAS_COLUMNAS.length) * 100;

  const hayAlgunaSeleccion =
    voto.formulaPresidencial !== undefined ||
    voto.senadorNacional !== undefined ||
    voto.senadorRegional !== undefined ||
    voto.diputado !== undefined ||
    voto.parlamentoAndino !== undefined;

  const renderColumna = (col: (typeof TODAS_COLUMNAS)[number], className = "") => {
    const config = CONFIG_COLUMNAS[col.configIdx];
    if (col.esFormula) {
      return (
        <ColumnaElectoral
          key={col.key}
          config={config}
          listas={DATOS.formulasPresidenciales}
          seleccion={voto.formulaPresidencial}
          onSeleccionarLista={seleccionarFormula}
          esFormula={true}
          className={className}
        />
      );
    }
    const ck = col.key as ColumnaKey;
    return (
      <ColumnaElectoral
        key={col.key}
        config={config}
        listas={COLUMNA_DATOS[ck]}
        seleccion={voto[ck]}
        onSeleccionarLista={(idLista) => seleccionarLista(ck, idLista)}
        onSetPreferencial={(slot, num) =>
          setPreferencial(ck, slot, num, config.maxPreferenciales)
        }
        esFormula={false}
        className={className}
      />
    );
  };

  const esUltima = columnaActiva === TODAS_COLUMNAS.length - 1;
  const headerColor = HEADER_COLORS[columnaActiva] ?? "bg-red-800";
  const colActualLabel = TAB_LABELS[TODAS_COLUMNAS[columnaActiva].key];

  return (
    <div className="max-w-full lg:grid lg:grid-cols-[1fr_260px] lg:items-start lg:gap-5">

    {/* ── Columna izquierda: cédula + resultado ── */}
    <div className="min-w-0">
      {/* Tutorial */}
      <TutorialOnboarding />

      {/* ── CÉDULA ── */}
      <div className="rounded-lg overflow-hidden border-2 border-gray-400 shadow-xl">

        {/* Franja bandera */}
        <div className="flex h-2" aria-hidden="true">
          <div className="flex-1 bg-red-700" />
          <div className="flex-1 bg-white border-y border-gray-300" />
          <div className="flex-1 bg-red-700" />
        </div>

        {/* Header unificado ONPE — reducido */}
        <div className="bg-red-700 text-white text-center py-2 px-4">
          <p className="text-[9px] sm:text-[10px] text-red-200 tracking-wide">
            REPÚBLICA DEL PERÚ — ONPE
          </p>
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest leading-tight">
            CÉDULA DE SUFRAGIO
          </h2>
          <p className="text-[9px] sm:text-[10px] text-red-200 tracking-wide mt-0.5">
            ELECCIONES GENERALES — 12 DE ABRIL DE 2026
          </p>
        </div>

        {/* Barra de progreso + steps — WCAG: touch target mínimo 44px */}
        <div className="bg-white border-b border-gray-300 px-3 pt-2 pb-1">
          {/* Texto progreso */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-600 font-semibold">Progreso</span>
            <span className="text-[11px] font-bold text-gray-800">
              {columnasMarcadas} / 5 columnas
            </span>
          </div>
          {/* Barra */}
          <div
            className="w-full bg-gray-200 rounded-full h-2"
            role="progressbar"
            aria-valuenow={columnasMarcadas}
            aria-valuemin={0}
            aria-valuemax={5}
            aria-label={`${columnasMarcadas} de 5 columnas completadas`}
          >
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progreso}%`,
                backgroundColor: progreso === 100 ? "#16a34a" : "#dc2626",
              }}
            />
          </div>

          {/* Step buttons — mínimo 44px de altura (WCAG 2.5.5) */}
          <div className="flex gap-1 mt-1.5" role="tablist" aria-label="Columnas de la cédula">
            {TODAS_COLUMNAS.map((col, idx) => {
              const marcado = tieneSeleccion(col.key);
              const activo = columnaActiva === idx;
              const label = TAB_LABELS[col.key];
              return (
                <button
                  key={col.key}
                  type="button"
                  role="tab"
                  aria-selected={activo}
                  aria-label={`${label.full}${marcado ? " — marcado" : ""}`}
                  onClick={() => setColumnaActiva(idx)}
                  className={`
                    flex-1 flex flex-col items-center justify-center gap-0.5
                    min-h-[44px] rounded transition-all
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                    ${activo
                      ? "bg-gray-100 ring-1 ring-gray-400"
                      : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className={`w-full h-1.5 rounded-full transition-colors ${
                    marcado ? "bg-green-500" : activo ? "bg-gray-500" : "bg-gray-300"
                  }`} />
                  <span className="text-[8px] font-semibold leading-none mt-0.5 text-gray-600 hidden sm:block">
                    {label.short}
                  </span>
                  {marcado && (
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full sm:hidden" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── VISTA MÓVIL: una columna a la vez ── */}
        <div className="lg:hidden flex flex-col">

          {/* Active column */}
          <div className="min-h-[72vh] bg-white flex flex-col" role="tabpanel">
            {renderColumna(TODAS_COLUMNAS[columnaActiva], "flex-1")}
          </div>

          {/* Navigation bar — WCAG: min-h 52px, nombre columna visible */}
          <div className={`flex border-t-2 border-white/20 ${headerColor}`}>
            {/* ATRÁS */}
            <button
              type="button"
              onClick={() => setColumnaActiva((c) => Math.max(0, c - 1))}
              disabled={columnaActiva === 0}
              aria-label="Columna anterior"
              className="
                w-24 shrink-0 py-3.5 text-sm font-bold text-white/80 hover:text-white
                hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed
                transition-colors border-r border-white/20 min-h-[52px]
              "
            >
              ← Atrás
            </button>

            {/* Nombre de la columna activa */}
            <div className="flex-1 flex flex-col items-center justify-center px-2 select-none">
              <span className="text-[10px] text-white/50 font-medium leading-none">
                {columnaActiva + 1} de {TODAS_COLUMNAS.length}
              </span>
              <span className="text-[12px] sm:text-sm text-white font-black leading-tight text-center mt-0.5">
                {colActualLabel.full}
              </span>
            </div>

            {/* SIGUIENTE / VERIFICAR */}
            {esUltima ? (
              <button
                type="button"
                onClick={handleValidar}
                aria-label="Verificar mi voto"
                className="
                  w-24 shrink-0 py-3.5 text-sm font-bold text-white bg-green-600
                  hover:bg-green-700 transition-colors min-h-[52px]
                "
              >
                ✓ Verificar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setColumnaActiva((c) => Math.min(TODAS_COLUMNAS.length - 1, c + 1))}
                aria-label={`Ir a ${TAB_LABELS[TODAS_COLUMNAS[columnaActiva + 1]?.key ?? "senadorNacional"].full}`}
                className="
                  w-24 shrink-0 py-3.5 text-sm font-bold text-white hover:bg-white/10
                  transition-colors min-h-[52px]
                "
              >
                Siguiente →
              </button>
            )}
          </div>
        </div>

        {/* ── DESKTOP (lg+): 5 columnas side-by-side ── */}
        <div className="hidden lg:grid lg:grid-cols-5 border-t border-gray-400 divide-x divide-gray-300">
          {TODAS_COLUMNAS.map((col) => renderColumna(col))}
        </div>

      </div>

      {/* Nota legal */}
      <p className="text-[10px] text-gray-500 text-center mt-2 px-2">
        Simulador educativo. Datos referenciales del JNE. La cédula oficial es emitida por la ONPE.
      </p>

      {/* ── Botones acción MÓVIL ── */}
      {hayAlgunaSeleccion && (
        <div className="lg:hidden flex gap-2 mt-3 px-1">
          <button
            type="button"
            onClick={handleValidar}
            className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold
                       py-3.5 rounded-lg text-sm transition-colors shadow-md min-h-[48px]
                       flex items-center justify-center gap-2
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <span aria-hidden="true">✓</span> Verificar mi voto
          </button>
          <button
            type="button"
            onClick={handleReintentar}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold
                       py-3.5 px-4 rounded-lg text-sm transition-colors min-h-[48px]
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          >
            Borrar
          </button>
        </div>
      )}

      {/* ── Botón verificar MÓVIL (cuando no hay selección aún) ── */}
      {!hayAlgunaSeleccion && (
        <div className="lg:hidden mt-3 px-1">
          <button
            type="button"
            onClick={handleValidar}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold
                       py-3.5 rounded-lg text-sm transition-colors shadow-md min-h-[48px]
                       flex items-center justify-center gap-2
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <span aria-hidden="true">✓</span> Verificar mi voto
          </button>
        </div>
      )}

      {/* Resultado */}
      {mostrarResultado && resultado && (
        <div id="resultado-voto" className="mt-6">
          <ResultadoVoto
            resultado={resultado}
            voto={voto}
            datos={DATOS}
            onReintentar={handleReintentar}
          />
        </div>
      )}
    </div>{/* fin columna izquierda */}

    {/* ── Panel lateral DESKTOP ── */}
    <div className="hidden lg:block pt-0">
      <ResumenVotoLateral
        voto={voto}
        datos={DATOS}
        onValidar={handleValidar}
        onBorrar={handleReintentar}
      />
    </div>

    </div>
  );
}
