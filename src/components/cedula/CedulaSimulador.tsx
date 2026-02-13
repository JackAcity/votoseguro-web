"use client";

import { useState, useEffect } from "react";
import { ColumnaElectoral } from "./ColumnaElectoral";
import { ResultadoVoto } from "./ResultadoVoto";
import { useCedula } from "@/hooks/useCedula";
import { CONFIG_COLUMNAS } from "@/lib/cedula-logic";
import { DATOS_SIMULADOR } from "@/lib/mock-data";
import { initSesion, registrarIntencionVoto } from "@/lib/analytics";
import type { VotoCedula } from "@/lib/types";

const DATOS = DATOS_SIMULADOR;

type ColumnaKey = keyof Omit<VotoCedula, "formulaPresidencial">;

// Todas las columnas en orden
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

const COLUMNA_DATOS: Record<ColumnaKey, typeof DATOS.senadoresNacionales> = {
  senadorNacional: DATOS.senadoresNacionales,
  senadorRegional: DATOS.senadoresRegionales,
  diputado: DATOS.diputados,
  parlamentoAndino: DATOS.parlamentoAndino,
};

// Nombres cortos para tabs en móvil
const TAB_LABELS: Record<string, { short: string; emoji: string }> = {
  formulaPresidencial: { short: "Presidente", emoji: "🏛️" },
  senadorNacional: { short: "Sen. Nac.", emoji: "🗳️" },
  senadorRegional: { short: "Sen. Reg.", emoji: "📍" },
  diputado: { short: "Diputados", emoji: "🏛️" },
  parlamentoAndino: { short: "Andino", emoji: "🌎" },
};

export function CedulaSimulador() {
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
  // Tab activo en móvil (0 = Presidencial, ..., 4 = Parlamento Andino)
  const [tabActivo, setTabActivo] = useState(0);

  // Iniciar sesión anónima al montar el simulador
  useEffect(() => {
    initSesion()
  }, [])

  const handleValidar = () => {
    validar();
    setMostrarResultado(true);

    // Capturar intención de voto — fire and forget, no bloquea UI
    const selecciones: Parameters<typeof registrarIntencionVoto>[1] = {}
    // Fórmula presidencial (número = id de lista directamente)
    if (voto.formulaPresidencial !== undefined) {
      const lista = DATOS.formulasPresidenciales.find(
        f => f.id === voto.formulaPresidencial
      )
      if (lista) {
        selecciones["formulaPresidencial"] = {
          nombreOrganizacion: lista.organizacion.nombre,
          idOrganizacion:     lista.organizacion.id,
          esBlanco: false, esNulo: false, esValido: true,
        }
      }
    }
    // Columnas con SeleccionColumna (idLista + preferencias)
    ;(["senadorNacional", "senadorRegional", "diputado", "parlamentoAndino"] as ColumnaKey[])
      .forEach(key => {
        const sel = voto[key]
        if (!sel) return
        const lista = COLUMNA_DATOS[key]?.find(l => l.id === sel.idLista)
        if (lista) {
          selecciones[key] = {
            nombreOrganizacion: lista.organizacion.nombre,
            idOrganizacion:     lista.organizacion.id,
            esBlanco: false, esNulo: false, esValido: true,
          }
        }
      })
    if (Object.keys(selecciones).length > 0 && resultado) {
      registrarIntencionVoto(resultado, selecciones)
    }

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

  const hayAlgunaSeleccion =
    voto.formulaPresidencial !== undefined ||
    voto.senadorNacional !== undefined ||
    voto.senadorRegional !== undefined ||
    voto.diputado !== undefined ||
    voto.parlamentoAndino !== undefined;

  // Indicador de columnas con selección
  const tieneSeleccion = (key: string) => {
    if (key === "formulaPresidencial") return voto.formulaPresidencial !== undefined;
    return voto[key as ColumnaKey] !== undefined;
  };

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
      {/* Header de la cédula */}
      <div className="bg-white border border-gray-400 rounded-t-lg">
        <div className="bg-red-700 text-white text-center py-2 rounded-t-lg">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest">
            REPÚBLICA DEL PERÚ
          </h2>
          <p className="text-[10px] sm:text-xs text-red-200">
            OFICINA NACIONAL DE PROCESOS ELECTORALES — ONPE
          </p>
        </div>
        <div className="bg-gray-100 text-center py-1.5 border-b border-gray-300">
          <p className="text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wide">
            CÉDULA DE SUFRAGIO — ELECCIONES GENERALES 2026
          </p>
          <p className="text-[9px] sm:text-[10px] text-gray-500">
            Simulador educativo — No es cédula oficial
          </p>
        </div>
      </div>

      {/* ── MÓVIL / TABLET (<lg): Tabs + una columna a la vez ── */}
      <div className="lg:hidden border border-t-0 border-gray-400 rounded-b-lg overflow-hidden">
        {/* Tabs de navegación entre columnas */}
        <div className="flex overflow-x-auto bg-gray-800 scrollbar-hide">
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
                  px-3 py-2 min-w-[64px] text-center transition-colors
                  border-b-2 relative
                  ${activo
                    ? "border-yellow-400 bg-gray-700 text-white"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                  }
                `}
                aria-selected={activo}
              >
                <span className="text-base leading-none">{label.emoji}</span>
                <span className="text-[9px] mt-0.5 leading-tight whitespace-nowrap">
                  {label.short}
                </span>
                {/* Indicador de selección */}
                {marcado && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Progreso */}
        <div className="bg-gray-100 px-3 py-1 flex items-center justify-between border-b border-gray-300">
          <span className="text-[10px] text-gray-500">
            Columna {tabActivo + 1} de {TODAS_COLUMNAS.length}
          </span>
          <span className="text-[10px] text-gray-500">
            {TODAS_COLUMNAS.filter((c) => tieneSeleccion(c.key)).length} de 5 marcadas
          </span>
        </div>

        {/* Columna activa */}
        <div className="min-h-[400px]">
          {renderColumna(TODAS_COLUMNAS[tabActivo])}
        </div>

        {/* Navegación anterior/siguiente */}
        <div className="flex border-t border-gray-300 bg-gray-50">
          <button
            type="button"
            onClick={() => setTabActivo((t) => Math.max(0, t - 1))}
            disabled={tabActivo === 0}
            className="flex-1 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors
                       border-r border-gray-300 min-h-[44px]"
          >
            ← Anterior
          </button>
          {tabActivo < TODAS_COLUMNAS.length - 1 ? (
            <button
              type="button"
              onClick={() => setTabActivo((t) => Math.min(TODAS_COLUMNAS.length - 1, t + 1))}
              className="flex-1 py-3 text-sm font-semibold text-red-700 hover:bg-red-50
                         transition-colors min-h-[44px]"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleValidar}
              className="flex-1 py-3 text-sm font-bold bg-red-700 text-white
                         hover:bg-red-800 transition-colors min-h-[44px]"
            >
              Verificar mi voto ✓
            </button>
          )}
        </div>
      </div>

      {/* ── DESKTOP (lg+): 5 columnas completas ── */}
      <div className="hidden lg:grid lg:grid-cols-5 border border-t-0 border-gray-400 rounded-b-lg overflow-hidden">
        {TODAS_COLUMNAS.map((col) => renderColumna(col))}
      </div>

      {/* Nota legal */}
      <p className="text-[9px] sm:text-[10px] text-gray-400 text-center mt-2 px-2">
        ⚠ Simulador educativo. Datos referenciales. La cédula oficial es emitida por la ONPE.
      </p>

      {/* Botones de acción — Desktop */}
      <div className="hidden lg:flex gap-3 mt-4 justify-center">
        <button
          type="button"
          onClick={handleValidar}
          className="bg-red-700 hover:bg-red-800 text-white font-bold
                     py-3 px-8 rounded-lg text-sm transition-colors shadow-md min-h-[44px]"
        >
          Verificar mi voto →
        </button>
        {hayAlgunaSeleccion && (
          <button
            type="button"
            onClick={handleReintentar}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold
                       py-3 px-6 rounded-lg text-sm transition-colors min-h-[44px]"
          >
            Borrar todo
          </button>
        )}
      </div>

      {/* Botones — Móvil (solo mostrar si ya vio todas las columnas o hay selección) */}
      {hayAlgunaSeleccion && (
        <div className="lg:hidden flex gap-2 mt-3 px-1">
          <button
            type="button"
            onClick={handleValidar}
            className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold
                       py-3 rounded-lg text-sm transition-colors shadow-md min-h-[44px]"
          >
            ✓ Verificar mi voto
          </button>
          <button
            type="button"
            onClick={handleReintentar}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold
                       py-3 px-4 rounded-lg text-sm transition-colors min-h-[44px]"
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
