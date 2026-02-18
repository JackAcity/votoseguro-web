"use client";

import Image from "next/image";
import { FilaPartido } from "./FilaPartido";
import { getLogoPartido } from "@/lib/partidos-logos";
import type {
  ListaElectoral,
  SeleccionColumna,
  ConfigColumna,
} from "@/lib/types";

// Accent colours per column index
const COLUMNA_COLORS: Record<number, { header: string; accent: string; border: string }> = {
  0: { header: "bg-red-800",    accent: "border-l-red-700",    border: "border-red-700"    },
  1: { header: "bg-blue-900",   accent: "border-l-blue-700",   border: "border-blue-700"   },
  2: { header: "bg-green-900",  accent: "border-l-green-700",  border: "border-green-700"  },
  3: { header: "bg-purple-900", accent: "border-l-purple-700", border: "border-purple-700" },
  4: { header: "bg-yellow-700", accent: "border-l-yellow-600", border: "border-yellow-600" },
};

interface ColumnaElectoralProps {
  config: ConfigColumna;
  listas: ListaElectoral[];
  seleccion: SeleccionColumna | number | undefined;
  onSeleccionarLista: (idLista: number) => void;
  className?: string;
  onSetPreferencial?: (slot: number, numeroCandidato: number | null) => void;
  esFormula?: boolean;
}

export function ColumnaElectoral({
  config,
  listas,
  seleccion,
  onSeleccionarLista,
  onSetPreferencial,
  esFormula = false,
  className = "",
}: ColumnaElectoralProps) {
  const seleccionColumna = esFormula
    ? undefined
    : (seleccion as SeleccionColumna | undefined);
  const seleccionFormula = esFormula ? (seleccion as number | undefined) : undefined;

  // Determine column colour index by title
  const colIdx = config.titulo.toLowerCase().includes("presidencial") ? 0
    : config.titulo.toLowerCase().includes("nacional") ? 1
    : config.titulo.toLowerCase().includes("regional") ? 2
    : config.titulo.toLowerCase().includes("diputado") ? 3
    : 4;
  const colors = COLUMNA_COLORS[colIdx] ?? COLUMNA_COLORS[0];

  const tieneSeleccion = esFormula
    ? seleccionFormula !== undefined
    : seleccionColumna !== undefined;

  return (
    <div className={`flex flex-col bg-white min-w-0 ${className}`}>

      {/* ── Column header ── */}
      <div className={`${colors.header} text-white px-3 py-2.5 text-center sticky top-0 z-10`}>
        <h3 className="text-[11px] sm:text-sm font-black uppercase leading-tight tracking-wide">
          {config.titulo}
        </h3>
        <p className="text-[9px] sm:text-[10px] text-white/70 leading-tight mt-0.5">
          {config.subtitulo}
        </p>
        {tieneSeleccion && (
          <div className="mt-1 flex items-center justify-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span className="text-[8px] text-green-300 font-semibold">MARCADO</span>
          </div>
        )}
      </div>

      {/* ── Table column headers ── */}
      <div className="flex items-center border-b-2 border-gray-300 bg-gray-100 text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-wide">
        {/* Aspa */}
        <div className="w-12 shrink-0 text-center py-1.5">✗</div>
        {/* Partido */}
        <div className="flex-1 min-w-0 py-1.5 pl-1">Partido</div>
        {/* Símbolo */}
        <div className="w-12 shrink-0 text-center py-1.5 border-l border-gray-200">Símbolo</div>
        {/* Right column header */}
        {esFormula ? (
          <div className="w-14 shrink-0 text-center py-1.5 border-l border-gray-200">Foto</div>
        ) : config.maxPreferenciales > 0 ? (
          <div
            className="shrink-0 text-center py-1.5 border-l border-gray-200"
            style={{ width: config.maxPreferenciales === 1 ? "52px" : "88px" }}
          >
            Pref.
          </div>
        ) : null}
      </div>

      {/* ── Instruction strip ── */}
      <div className="bg-gray-50 px-3 py-1 border-b border-gray-200">
        <p className="text-[8px] sm:text-[9px] text-gray-500 text-center leading-tight">
          {config.descripcionVoto}
        </p>
      </div>

      {/* ── Rows ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Empty state when no department selected */}
        {!esFormula && listas.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] px-4 py-8 text-center gap-3">
            <span className="text-3xl">📍</span>
            <p className="text-xs font-bold text-gray-500 leading-snug">
              Selecciona tu departamento para ver los candidatos de esta columna
            </p>
          </div>
        )}

        {listas.map((lista) => {

          /* ── FÓRMULA PRESIDENCIAL ── */
          if (esFormula) {
            const isSelected = seleccionFormula === lista.id;
            const logoUrl = getLogoPartido(lista.organizacion.id);
            const fotoUrl = lista.presidente?.fotoUrl;

            return (
              <div
                key={lista.id}
                className={`
                  flex items-stretch border-b border-gray-200 transition-colors cursor-pointer
                  border-l-4 min-h-[60px]
                  ${isSelected
                    ? `bg-blue-50 ${colors.accent}`
                    : "border-l-transparent hover:bg-gray-50"
                  }
                `}
                onClick={() => onSeleccionarLista(lista.id)}
              >
                {/* Aspa */}
                <div className="flex items-center justify-center w-12 shrink-0">
                  <div
                    className={`
                      w-8 h-8 border-2 flex items-center justify-center rounded-sm
                      transition-colors shrink-0
                      ${isSelected ? "border-blue-700 bg-white shadow-sm" : "border-gray-300 bg-white"}
                    `}
                  >
                    {isSelected && (
                      <span className="text-lg font-black select-none leading-none text-blue-800">✗</span>
                    )}
                  </div>
                </div>

                {/* Party name + president */}
                <div className="flex-1 min-w-0 flex flex-col justify-center py-1.5 pr-1">
                  <p className="text-[9px] font-black text-gray-800 uppercase leading-tight line-clamp-2">
                    {lista.organizacion.nombre}
                  </p>
                  {lista.presidente && (
                    <p className="text-[10px] font-semibold text-gray-700 leading-tight mt-0.5">
                      {lista.presidente.nombres} {lista.presidente.apellidoPaterno}
                    </p>
                  )}
                  {lista.vicepresidente1 && (
                    <p className="text-[9px] text-gray-400 leading-tight truncate">
                      VP: {lista.vicepresidente1.nombres} {lista.vicepresidente1.apellidoPaterno}
                    </p>
                  )}
                  {lista.presidente?.estado === "IMPUGNADO" && (
                    <span className="inline-block bg-red-100 text-red-600 text-[8px] font-bold px-1 rounded mt-0.5">
                      IMPUGNADO
                    </span>
                  )}
                </div>

                {/* Logo (símbolo) */}
                <div className="flex items-center justify-center w-12 shrink-0 py-2 border-l border-gray-100">
                  {logoUrl ? (
                    <div className="relative w-10 h-10 border border-gray-200 rounded-sm overflow-hidden bg-white">
                      <Image
                        src={logoUrl}
                        alt={`Logo ${lista.organizacion.nombre}`}
                        fill
                        className="object-contain p-0.5"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-sm flex items-center justify-center border border-gray-200"
                      style={{ backgroundColor: lista.organizacion.colorPrimario + "22" }}
                    >
                      <span className="text-[8px] font-black text-gray-600 text-center leading-tight px-0.5">
                        {lista.organizacion.sigla.slice(0, 4)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Candidate photo */}
                <div className="shrink-0 w-14 self-stretch overflow-hidden bg-gray-100 border-l border-gray-100">
                  {fotoUrl ? (
                    <div className="relative w-full h-full min-h-[60px]">
                      <Image
                        src={fotoUrl}
                        alt={lista.presidente?.nombreCompleto ?? "Candidato"}
                        fill
                        className="object-cover object-top"
                        unoptimized
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-400/20" />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full min-h-[60px] flex items-center justify-center bg-gray-100">
                      <span className="text-gray-300 text-xl">👤</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          /* ── OTRAS COLUMNAS (senadores, diputados, andino) ── */
          return (
            <FilaPartido
              key={lista.id}
              lista={lista}
              seleccion={seleccionColumna}
              onSeleccionarLista={onSeleccionarLista}
              onSetPreferencial={(slot, num) => onSetPreferencial?.(slot, num)}
              maxPreferenciales={config.maxPreferenciales}
              accentColor={colors.accent}
            />
          );
        })}
      </div>
    </div>
  );
}
