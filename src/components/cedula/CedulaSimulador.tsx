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
  { key: "senadorNacional", configIdx: 1, esFormula: false },
  { key: "senadorRegional", configIdx: 2, esFormula: false },
  { key: "diputado", configIdx: 3, esFormula: false },
  { key: "parlamentoAndino", configIdx: 4, esFormula: false },
];

const TAB_LABELS: Record<string, { short: string; emoji: string; full: string }> = {
  formulaPresidencial: { short: "Presidente", emoji: "🏛️", full: "Fórmula Presidencial" },
  senadorNacional:     { short: "Sen. Nac.", emoji: "🗳️", full: "Senadores Nacionales" },
  senadorRegional:     { short: "Sen. Reg.", emoji: "📍", full: "Senadores Regionales" },
  diputado:            { short: "Diputados", emoji: "🏛️", full: "Diputados" },
  parlamentoAndino:    { short: "Andino", emoji: "🌎", full: "Parlamento Andino" },
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
    togglePreferencial,
    resetear,
    validar,
  } = useCedula();

  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [tabActivo, setTabActivo] = useState(0);

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
    setTabActivo(0);
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

  const renderColumna = (
    col: (typeof TODAS_COLUMNAS)[number],
    className = ""
  ) => {
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
        onTogglePreferencial={(num) =>
          togglePreferencial(ck, num, config.maxPreferenciales)
        }
        esFormula={false}
        className={className}
      />
    );
  };

  return (
    <div className="max-w-full">
      {/* Tutorial onboarding (solo primera visita) */}
      <TutorialOnboarding />

      {/* ── CÉDULA OFICIAL ── */}
      <div className="rounded-lg overflow-hidden border-2 border-gray-500 shadow-xl">

        {/* Franja superior rojo-blanco-rojo (bandera) */}
        <div className="flex h-2">
          <div className="flex-1 bg-red-700" />
          <div className="flex-1 bg-white border-y border-gray-300" />
          <div className="flex-1 bg-red-700" />
        </div>

        {/* Header oficial */}
        <div className="bg-red-700 text-white text-center py-2.5 px-4">
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
        <div className="bg-white border-b border-gray-300 px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500 font-medium">
              Progreso del voto
            </span>
            <span className="text-[10px] font-bold text-gray-700">
              {columnasMarcadas} de 5 columnas marcadas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progreso}%`,
                backgroundColor: progreso === 100 ? "#16a34a" : "#dc2626",
              }}
            />
          </div>
          {/* Indicadores por columna */}
          <div className="flex gap-1 mt-1.5">
            {TODAS_COLUMNAS.map((col) => {
              const marcado = tieneSeleccion(col.key);
              const label = TAB_LABELS[col.key];
              return (
                <div key={col.key} className="flex-1 flex flex-col items-center gap-0.5">
                  <div
                    className={`w-full h-1 rounded-full transition-colors ${
                      marcado ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                  <span className="text-[7px] text-gray-400 hidden sm:block truncate text-center w-full">
                    {label.emoji}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MÓVIL / TABLET (<lg): Tabs + una columna a la vez ── */}
        <div className="lg:hidden">
          {/* Tabs */}
          <div className="flex overflow-x-auto bg-gray-900 scrollbar-hide">
            {TODAS_COLUMNAS.map((col, idx) => {
              const label = TAB_LABELS[col.key];
              const activo = tabActivo === idx;
              const marcado = tieneSeleccion(col.key);
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => setTabActivo(idx)}
                  className={`
                    flex-shrink-0 flex flex-col items-center justify-center
                    px-3 py-2.5 min-w-[68px] text-center transition-all
                    border-b-2 relative
                    ${activo
                      ? "border-yellow-400 bg-gray-700 text-white"
                      : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    }
                  `}
                  aria-selected={activo}
                >
                  <span className="text-sm leading-none">{label.emoji}</span>
                  <span className="text-[8px] mt-0.5 leading-tight whitespace-nowrap">
                    {label.short}
                  </span>
                  {marcado && (
                    <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-green-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Columna activa */}
          <div className="min-h-[400px] bg-white">
            {renderColumna(TODAS_COLUMNAS[tabActivo])}
          </div>

          {/* Navegación anterior/siguiente */}
          <div className="flex border-t-2 border-gray-300 bg-gray-50">
            <button
              type="button"
              onClick={() => setTabActivo((t) => Math.max(0, t - 1))}
              disabled={tabActivo === 0}
              className="flex-1 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-100
                         disabled:opacity-30 disabled:cursor-not-allowed transition-colors
                         border-r border-gray-300 min-h-[48px]"
            >
              ← Anterior
            </button>
            {tabActivo < TODAS_COLUMNAS.length - 1 ? (
              <button
                type="button"
                onClick={() => setTabActivo((t) => Math.min(TODAS_COLUMNAS.length - 1, t + 1))}
                className="flex-1 py-3.5 text-sm font-semibold text-red-700 hover:bg-red-50
                           transition-colors min-h-[48px]"
              >
                Siguiente →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleValidar}
                className="flex-1 py-3.5 text-sm font-bold bg-red-700 text-white
                           hover:bg-red-800 transition-colors min-h-[48px]"
              >
                ✓ Verificar mi voto
              </button>
            )}
          </div>
        </div>

        {/* ── DESKTOP (lg+): 5 columnas completas ── */}
        <div className="hidden lg:grid lg:grid-cols-5 border-t border-gray-400">
          {TODAS_COLUMNAS.map((col) => renderColumna(col))}
        </div>

      </div>

      {/* Nota legal */}
      <p className="text-[9px] sm:text-[10px] text-gray-400 text-center mt-2 px-2">
        ⚠ Simulador educativo. Datos referenciales del JNE. La cédula oficial es emitida por la ONPE.
      </p>

      {/* Botones de acción — Desktop */}
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

      {/* Botones — Móvil */}
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
