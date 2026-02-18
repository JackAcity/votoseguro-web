"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getLogoPartido } from "@/lib/partidos-logos";
import type { ListaElectoral, SeleccionColumna } from "@/lib/types";

interface FilaPartidoProps {
  lista: ListaElectoral;
  seleccion: SeleccionColumna | undefined;
  onSeleccionarLista: (idLista: number) => void;
  onSetPreferencial: (slot: number, numeroCandidato: number | null) => void;
  maxPreferenciales: number;
  accentColor?: string;
}

export function FilaPartido({
  lista,
  seleccion,
  onSeleccionarLista,
  onSetPreferencial,
  maxPreferenciales,
  accentColor = "border-l-red-700",
}: FilaPartidoProps) {
  const isSelected = seleccion?.idLista === lista.id;
  const prefs = seleccion?.idLista === lista.id ? (seleccion?.preferencias ?? []) : [];
  const { organizacion } = lista;
  const logoUrl = getLogoPartido(organizacion.id);

  // Local input state (what the user is typing)
  const [inputVals, setInputVals] = useState<string[]>(() =>
    Array.from({ length: maxPreferenciales }, (_, i) =>
      prefs[i] ? String(prefs[i]) : ""
    )
  );

  // Sync inputs when external prefs change (e.g. reset)
  useEffect(() => {
    setInputVals(
      Array.from({ length: maxPreferenciales }, (_, i) =>
        prefs[i] ? String(prefs[i]) : ""
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected, seleccion?.preferencias?.join(","), maxPreferenciales]);

  const handleInputChange = (slot: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 4);
    const next = [...inputVals];
    next[slot] = cleaned;
    setInputVals(next);
  };

  const handleInputCommit = (slot: number) => {
    const val = parseInt(inputVals[slot], 10);
    onSetPreferencial(slot, isNaN(val) || val <= 0 ? null : val);
  };

  return (
    <div
      className={`
        flex items-stretch border-b border-gray-200 transition-colors cursor-pointer
        border-l-4 min-h-[52px] lg:min-h-[48px]
        ${isSelected
          ? `bg-blue-50 ${accentColor}`
          : "border-l-transparent hover:bg-gray-50"
        }
      `}
      onClick={() => onSeleccionarLista(lista.id)}
    >
      {/* Aspa (checkbox) */}
      <div className="flex items-center justify-center px-1.5 lg:px-1 shrink-0">
        <div
          className={`
            w-8 h-8 border-2 flex items-center justify-center rounded-sm
            transition-colors shrink-0
            ${isSelected
              ? "border-blue-700 bg-white shadow-sm"
              : "border-gray-300 bg-white"
            }
          `}
          onClick={(e) => { e.stopPropagation(); onSeleccionarLista(lista.id); }}
        >
          {isSelected && (
            <span className="text-lg font-black select-none leading-none text-blue-800">
              ✗
            </span>
          )}
        </div>
      </div>

      {/* Party name */}
      <div className="flex-1 min-w-0 flex items-center py-1 pr-1">
        <p className="text-[10px] font-bold text-gray-800 uppercase leading-tight line-clamp-4 lg:line-clamp-none lg:[overflow:visible] lg:whitespace-normal">
          {organizacion.nombre}
        </p>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center w-12 lg:w-9 shrink-0 py-1.5 border-l border-gray-100">
        {logoUrl ? (
          <div className="relative w-10 h-10 lg:w-8 lg:h-8 border border-gray-200 rounded-sm overflow-hidden bg-white">
            <Image
              src={logoUrl}
              alt={`Logo ${organizacion.nombre}`}
              fill
              className="object-contain p-0.5"
              unoptimized
            />
          </div>
        ) : (
          <div
            className="w-10 h-10 lg:w-8 lg:h-8 rounded-sm flex items-center justify-center border border-gray-200"
            style={{ backgroundColor: organizacion.colorPrimario + "22" }}
          >
            <span className="text-[8px] font-black text-gray-600 text-center leading-tight px-0.5">
              {organizacion.sigla.slice(0, 4)}
            </span>
          </div>
        )}
      </div>

      {/* Preferential input boxes — always visible */}
      {maxPreferenciales > 0 && (
        <div
          className="flex items-center justify-center gap-1 lg:gap-0.5 px-1.5 lg:px-1 shrink-0 border-l border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {Array.from({ length: maxPreferenciales }).map((_, slot) => {
            const hasVal = isSelected && !!prefs[slot];
            return (
              <input
                key={slot}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="—"
                disabled={!isSelected}
                value={isSelected ? (inputVals[slot] ?? "") : ""}
                onChange={(e) => handleInputChange(slot, e.target.value)}
                onBlur={() => handleInputCommit(slot)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className={`
                  w-11 h-11 lg:w-8 lg:h-8 text-center text-[10px] lg:text-[9px] font-black rounded border-2
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  transition-colors
                  ${!isSelected
                    ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : hasVal
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-300 bg-white text-gray-700 placeholder-gray-300"
                  }
                `}
                aria-label={`Preferencia ${slot + 1} para ${organizacion.nombre}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
