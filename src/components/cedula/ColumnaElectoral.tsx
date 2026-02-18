"use client";

import Image from "next/image";
import { FilaPartido } from "./FilaPartido";
import { getLogoPartido } from "@/lib/partidos-logos";
import type {
  ListaElectoral,
  SeleccionColumna,
  ConfigColumna,
} from "@/lib/types";

// Colores de acento por columna (índice en CONFIG_COLUMNAS)
const COLUMNA_COLORS: Record<number, { header: string; badge: string; accent: string }> = {
  0: { header: "bg-red-800",    badge: "bg-red-100 text-red-800",    accent: "border-l-red-700"    },
  1: { header: "bg-blue-900",   badge: "bg-blue-100 text-blue-800",  accent: "border-l-blue-700"   },
  2: { header: "bg-green-900",  badge: "bg-green-100 text-green-800",accent: "border-l-green-700"  },
  3: { header: "bg-purple-900", badge: "bg-purple-100 text-purple-800",accent: "border-l-purple-700"},
  4: { header: "bg-yellow-700", badge: "bg-yellow-100 text-yellow-800",accent: "border-l-yellow-600"},
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

  // Determinar índice de columna según título para asignar colores
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
    <div className={`flex flex-col bg-white border-r border-gray-300 last:border-r-0 min-w-0 ${className}`}>
      {/* Encabezado de columna */}
      <div className={`${colors.header} text-white px-2 py-2 text-center`}>
        <h3 className="text-[10px] sm:text-[11px] font-black uppercase leading-tight tracking-wide">
          {config.titulo}
        </h3>
        <p className="text-[8px] sm:text-[9px] text-white/70 leading-tight mt-0.5">
          {config.subtitulo}
        </p>
        {config.maxPreferenciales > 0 && (
          <span className={`inline-block mt-1.5 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${colors.badge}`}>
            Hasta {config.maxPreferenciales} pref.
          </span>
        )}
        {/* Indicador de selección */}
        {tieneSeleccion && (
          <div className="mt-1 flex items-center justify-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span className="text-[7px] text-green-300 font-semibold">MARCADO</span>
          </div>
        )}
      </div>

      {/* Instrucción */}
      <div className="bg-gray-50 px-2 py-1 border-b border-gray-200">
        <p className="text-[8px] sm:text-[9px] text-gray-500 text-center leading-tight">
          {config.descripcionVoto}
        </p>
      </div>

      {/* Lista de partidos */}
      <div className="flex-1 overflow-y-auto">
        {/* Aviso cuando no hay candidatos por falta de departamento */}
        {!esFormula && listas.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] px-4 py-8 text-center gap-3">
            <span className="text-3xl">📍</span>
            <p className="text-xs font-bold text-gray-500 leading-snug">
              Selecciona tu departamento arriba para ver los candidatos de esta columna
            </p>
          </div>
        )}
        {listas.map((lista) => {
          if (esFormula) {
            const isSelected = seleccionFormula === lista.id;
            const logoUrl = getLogoPartido(lista.organizacion.id);
            const fotoUrl = lista.presidente?.fotoUrl;
            return (
              <div
                key={lista.id}
                className={`
                  border-b border-gray-200 transition-colors cursor-pointer
                  border-l-4
                  ${isSelected
                    ? `bg-yellow-50 ${colors.accent}`
                    : "border-l-transparent hover:bg-gray-50 hover:border-l-gray-200"
                  }
                `}
                onClick={() => onSeleccionarLista(lista.id)}
              >
                <div className="flex items-stretch">

                  {/* Columna izquierda: aspa */}
                  <div className="flex flex-col items-center justify-start pt-2 px-1.5 gap-1 shrink-0">
                    <div
                      className={`
                        w-7 h-7 border-2 flex items-center justify-center rounded-sm
                        transition-colors shrink-0
                        ${isSelected
                          ? "border-gray-700 bg-white shadow-sm"
                          : "border-gray-300 bg-white"
                        }
                      `}
                    >
                      {isSelected && (
                        <span className="text-base font-black select-none leading-none text-gray-800">
                          ✗
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Logo del partido */}
                  <div className="flex items-center justify-center w-10 shrink-0 py-2">
                    {logoUrl ? (
                      <div className="relative w-9 h-9 border border-gray-200 rounded-sm overflow-hidden bg-white">
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
                        className="w-9 h-9 rounded-sm flex items-center justify-center border border-gray-200"
                        style={{ backgroundColor: lista.organizacion.colorPrimario + "22" }}
                      >
                        <span className="text-[8px] font-black text-gray-600 text-center leading-tight px-0.5">
                          {lista.organizacion.sigla.slice(0, 3)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info partido + candidato */}
                  <div className="flex-1 min-w-0 py-1.5 pr-1">
                    <p className="text-[9px] font-black text-gray-800 uppercase leading-tight line-clamp-2">
                      {lista.organizacion.nombre}
                    </p>
                    {lista.presidente && (
                      <div className="mt-0.5">
                        <p className="text-[10px] font-semibold text-gray-700 leading-tight">
                          {lista.presidente.nombres}{" "}
                          {lista.presidente.apellidoPaterno}
                        </p>
                        {lista.vicepresidente1 && (
                          <p className="text-[9px] text-gray-400 leading-tight truncate">
                            VP: {lista.vicepresidente1.nombres}{" "}
                            {lista.vicepresidente1.apellidoPaterno}
                          </p>
                        )}
                        {lista.presidente.estado === "IMPUGNADO" && (
                          <span className="inline-block bg-red-100 text-red-600 text-[8px] font-bold px-1 rounded mt-0.5">
                            IMPUGNADO
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Foto del candidato presidencial */}
                  {fotoUrl && (
                    <div className="shrink-0 w-12 self-stretch overflow-hidden bg-gray-100 border-l border-gray-100">
                      <div className="relative w-full h-full min-h-[64px]">
                        <Image
                          src={fotoUrl}
                          alt={lista.presidente?.nombreCompleto ?? "Candidato"}
                          fill
                          className="object-cover object-top"
                          unoptimized
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-yellow-400/20" />
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          }

          return (
            <FilaPartido
              key={lista.id}
              lista={lista}
              seleccion={seleccionColumna}
              onSeleccionarLista={onSeleccionarLista}
              onSetPreferencial={(slot, num) => onSetPreferencial?.(slot, num)}
              maxPreferenciales={config.maxPreferenciales}
              mostrarFormula={false}
              accentColor={colors.accent}
            />
          );
        })}
      </div>
    </div>
  );
}
