"use client";

import { useState } from "react";
import { ColumnaElectoral } from "./ColumnaElectoral";
import { ResultadoVoto } from "./ResultadoVoto";
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

const TAB_LABELS: Record<string, { short: string; emoji: string }> = {
  formulaPresidencial: { short: "Presidencial", emoji: "🏛️" },
  senadorNacional:     { short: "Sen. Nacional", emoji: "🗳️" },
  senadorRegional:     { short: "Sen. Regional", emoji: "📍" },
  diputado:            { short: "Diputados",     emoji: "🏛️" },
  parlamentoAndino:    { short: "P. Andino",     emoji: "🌎" },
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

  return (
    <div className="max-w-full">
      {/* Tutorial */}
      <TutorialOnboarding />

      {/* ── CÉDULA ── */}
      <div className="rounded-lg overflow-hidden border-2 border-gray-400 shadow-xl">

        {/* Franja bandera */}
        <div className="flex h-2">
          <div className="flex-1 bg-red-700" />
          <div className="flex-1 bg-white border-y border-gray-300" />
          <div className="flex-1 bg-red-700" />
        </div>

        {/* Header ONPE */}
        <div className="bg-red-700 text-white text-center py-2 px-4">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest">
            REPÚBLICA DEL PERÚ
          </h2>
          <p className="text-[9px] sm:text-[10px] text-red-200 tracking-wide">
            OFICINA NACIONAL DE PROCESOS ELECTORALES — ONPE
          </p>
        </div>

        {/* Sub-header cédula */}
        <div className="bg-gray-100 text-center py-1.5 px-4 border-b border-gray-400">
          <p className="text-[11px] sm:text-xs font-bold text-gray-800 uppercase tracking-widest">
            CÉDULA DE SUFRAGIO
          </p>
          <p className="text-[9px] sm:text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
            ELECCIONES GENERALES — 12 DE ABRIL DE 2026
          </p>
          <p className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5">
            Simulador educativo — No es cédula oficial ONPE
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="bg-white border-b border-gray-200 px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500 font-medium">Progreso del voto</span>
            <span className="text-[10px] font-bold text-gray-700">
              {columnasMarcadas} de 5 columnas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${progreso}%`,
                backgroundColor: progreso === 100 ? "#16a34a" : "#dc2626",
              }}
            />
          </div>

          {/* Step dots */}
          <div className="flex gap-1.5 mt-2">
            {TODAS_COLUMNAS.map((col, idx) => {
              const marcado = tieneSeleccion(col.key);
              const activo = columnaActiva === idx;
              const label = TAB_LABELS[col.key];
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => setColumnaActiva(idx)}
                  className={`
                    flex-1 flex flex-col items-center gap-0.5 py-1 rounded transition-all
                    ${activo ? "bg-gray-100 ring-1 ring-gray-300" : "hover:bg-gray-50"}
                  `}
                  title={label.short}
                >
                  <div className={`w-full h-1.5 rounded-full transition-colors ${
                    marcado ? "bg-green-500" : activo ? "bg-gray-400" : "bg-gray-200"
                  }`} />
                  <span className="text-[7px] text-gray-400 hidden sm:block">{label.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── VISTA MÓVIL: una columna a la vez — full screen style ── */}
        <div className="lg:hidden flex flex-col">

          {/* Active column — fills screen */}
          <div className="min-h-[75vh] bg-white flex flex-col">
            {renderColumna(TODAS_COLUMNAS[columnaActiva], "flex-1")}
          </div>

          {/* Navigation bar — fixed at bottom of card */}
          <div className={`flex border-t-2 border-gray-300 ${headerColor}`}>
            {/* ATRÁS */}
            <button
              type="button"
              onClick={() => setColumnaActiva((c) => Math.max(0, c - 1))}
              disabled={columnaActiva === 0}
              className="
                flex-1 py-4 text-sm font-bold text-white/80 hover:text-white
                hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors border-r border-white/20 min-h-[52px]
              "
            >
              ← Atrás
            </button>

            {/* Column indicator */}
            <div className="flex items-center justify-center px-3 text-white/60 text-[10px] font-semibold shrink-0 select-none">
              {columnaActiva + 1} / {TODAS_COLUMNAS.length}
            </div>

            {/* SIGUIENTE / VERIFICAR */}
            {esUltima ? (
              <button
                type="button"
                onClick={handleValidar}
                className="
                  flex-1 py-4 text-sm font-bold text-white bg-green-600
                  hover:bg-green-700 transition-colors min-h-[52px]
                "
              >
                ✓ Verificar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setColumnaActiva((c) => Math.min(TODAS_COLUMNAS.length - 1, c + 1))}
                className="
                  flex-1 py-4 text-sm font-bold text-white hover:bg-white/10
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
      <p className="text-[9px] sm:text-[10px] text-gray-400 text-center mt-2 px-2">
        ⚠ Simulador educativo. Datos referenciales del JNE. La cédula oficial es emitida por la ONPE.
      </p>

      {/* ── Botones acción DESKTOP ── */}
      <div className="hidden lg:flex gap-3 mt-4 justify-center">
        <button
          type="button"
          onClick={handleValidar}
          className="bg-red-700 hover:bg-red-800 text-white font-bold
                     py-3.5 px-10 rounded-lg text-sm transition-colors shadow-md min-h-[48px]
                     flex items-center gap-2"
        >
          <span className="text-base">✓</span>
          Verificar mi voto
        </button>
        {hayAlgunaSeleccion && (
          <button
            type="button"
            onClick={handleReintentar}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold
                       py-3.5 px-6 rounded-lg text-sm transition-colors min-h-[48px]"
          >
            Borrar todo
          </button>
        )}
      </div>

      {/* ── Botones acción MÓVIL ── */}
      {hayAlgunaSeleccion && (
        <div className="lg:hidden flex gap-2 mt-3 px-1">
          <button
            type="button"
            onClick={handleValidar}
            className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold
                       py-3.5 rounded-lg text-sm transition-colors shadow-md min-h-[48px]
                       flex items-center justify-center gap-2"
          >
            <span>✓</span> Verificar mi voto
          </button>
          <button
            type="button"
            onClick={handleReintentar}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold
                       py-3.5 px-4 rounded-lg text-sm transition-colors min-h-[48px]"
          >
            Borrar
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
    </div>
  );
}
