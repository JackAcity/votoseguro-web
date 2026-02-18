"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MarcaVoto } from "./MarcaVoto";
import { getLogoPartido } from "@/lib/partidos-logos";
import type { ListaElectoral, SeleccionColumna } from "@/lib/types";

interface FilaPartidoProps {
  lista: ListaElectoral;
  seleccion: SeleccionColumna | undefined;
  onSeleccionarLista: (idLista: number) => void;
  onSetPreferencial: (slot: number, numeroCandidato: number | null) => void;
  maxPreferenciales: number;
  mostrarFormula?: boolean;
  accentColor?: string;
}

export function FilaPartido({
  lista,
  seleccion,
  onSeleccionarLista,
  onSetPreferencial,
  maxPreferenciales,
  mostrarFormula = false,
  accentColor = "border-l-red-700",
}: FilaPartidoProps) {
  const isSelected = seleccion?.idLista === lista.id;
  const prefs = seleccion?.preferencias ?? [];
  const { organizacion } = lista;
  const logoUrl = getLogoPartido(organizacion.id);

  // Estado local de los inputs (texto que el usuario escribe)
  const [inputVals, setInputVals] = useState<string[]>(() =>
    Array.from({ length: maxPreferenciales }, (_, i) =>
      prefs[i] ? String(prefs[i]) : ""
    )
  );

  // Sincronizar inputs cuando cambian las preferencias externas (ej. al resetear)
  useEffect(() => {
    setInputVals(
      Array.from({ length: maxPreferenciales }, (_, i) =>
        prefs[i] ? String(prefs[i]) : ""
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected, prefs.join(","), maxPreferenciales]);

  const handleInputChange = (slot: number, raw: string) => {
    // Solo permitir dígitos
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
        border-b border-gray-200 py-2 px-2 transition-colors
        border-l-2
        ${isSelected
          ? `bg-yellow-50 ${accentColor}`
          : "border-l-transparent hover:bg-gray-50 hover:border-l-gray-200"
        }
      `}
    >
      {/* Fila principal: número, marca, logo, nombre del partido */}
      <div className="flex items-center gap-1.5">
        {/* Número de lista */}
        <span className="text-[9px] font-black text-gray-400 w-3.5 shrink-0 text-center">
          {organizacion.numeroLista}
        </span>

        {/* Aspa de selección */}
        <MarcaVoto
          seleccionado={isSelected}
          onClick={() => onSeleccionarLista(lista.id)}
          colorPartido={organizacion.colorPrimario}
          size="sm"
        />

        {/* Logo del partido */}
        {logoUrl ? (
          <div className="relative w-7 h-7 shrink-0 border border-gray-200 rounded-sm overflow-hidden bg-white">
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
            className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0 border border-gray-200"
            style={{ backgroundColor: organizacion.colorPrimario + "22" }}
          >
            <span className="text-[7px] font-black text-gray-600 text-center leading-tight">
              {organizacion.sigla.slice(0, 2)}
            </span>
          </div>
        )}

        {/* Info del partido */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-gray-800 leading-tight truncate uppercase">
            {organizacion.nombre}
          </p>

          {/* Fórmula presidencial (opcional) */}
          {mostrarFormula && lista.presidente && (
            <div className="mt-0.5">
              <p className="text-[10px] font-semibold text-gray-700 leading-tight">
                {lista.presidente.nombres} {lista.presidente.apellidoPaterno}
              </p>
              {lista.vicepresidente1 && (
                <p className="text-[9px] text-gray-400 leading-tight">
                  VP1: {lista.vicepresidente1.nombres} {lista.vicepresidente1.apellidoPaterno}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Inputs de voto preferencial (solo cuando el partido está seleccionado) */}
      {isSelected && maxPreferenciales > 0 && (
        <div className="mt-2 ml-8 border-t border-yellow-200 pt-2">
          <p className="text-[9px] text-gray-400 mb-2 font-medium">
            Voto preferencial — opcional (escribe el N° del candidato):
          </p>
          <div className="flex gap-2">
            {Array.from({ length: maxPreferenciales }).map((_, slot) => (
              <div key={slot} className="flex flex-col items-center gap-1">
                <label className="text-[8px] text-gray-400 font-semibold uppercase tracking-wide">
                  Pref. {slot + 1}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="N°"
                  value={inputVals[slot] ?? ""}
                  onChange={(e) => handleInputChange(slot, e.target.value)}
                  onBlur={() => handleInputCommit(slot)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  className={`
                    w-14 h-10 text-center text-sm font-black rounded-md border-2
                    focus:outline-none focus:ring-2 focus:ring-yellow-400
                    transition-colors
                    ${prefs[slot]
                      ? "border-yellow-400 bg-yellow-50 text-gray-900"
                      : "border-gray-300 bg-white text-gray-700 placeholder-gray-300"
                    }
                  `}
                  aria-label={`Preferencia ${slot + 1} para ${organizacion.nombre}`}
                />
                {prefs[slot] ? (
                  <span className="text-[9px] text-yellow-700 font-bold">#{prefs[slot]}</span>
                ) : (
                  <span className="text-[9px] text-gray-300">—</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
