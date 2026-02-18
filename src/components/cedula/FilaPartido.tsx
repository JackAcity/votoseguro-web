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

  // Primer candidato de la lista (para mostrar foto y nombre)
  const primerCandidato = lista.candidatos[0] ?? lista.presidente ?? null;
  const fotoUrl = primerCandidato?.fotoUrl ?? null;

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
        border-b border-gray-200 transition-colors cursor-pointer
        border-l-4
        ${isSelected
          ? `bg-yellow-50 ${accentColor}`
          : "border-l-transparent hover:bg-gray-50 hover:border-l-gray-200"
        }
      `}
      onClick={() => onSeleccionarLista(lista.id)}
    >
      <div className="flex items-stretch">

        {/* Columna izquierda: aspa */}
        <div className="flex flex-col items-center justify-center pt-2 px-1.5 gap-1 shrink-0">
          <div
            className={`
              w-7 h-7 border-2 flex items-center justify-center rounded-sm
              transition-colors shrink-0
              ${isSelected
                ? "border-gray-700 bg-white shadow-sm"
                : "border-gray-300 bg-white"
              }
            `}
            onClick={(e) => { e.stopPropagation(); onSeleccionarLista(lista.id); }}
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
                alt={`Logo ${organizacion.nombre}`}
                fill
                className="object-contain p-0.5"
                unoptimized
              />
            </div>
          ) : (
            <div
              className="w-9 h-9 rounded-sm flex items-center justify-center border border-gray-200"
              style={{ backgroundColor: organizacion.colorPrimario + "22" }}
            >
              <span className="text-[8px] font-black text-gray-600 text-center leading-tight px-0.5">
                {organizacion.sigla.slice(0, 3)}
              </span>
            </div>
          )}
        </div>

        {/* Info partido + primer candidato */}
        <div className="flex-1 min-w-0 py-1.5 pr-1">
          <p className="text-[9px] font-black text-gray-800 uppercase leading-tight line-clamp-2">
            {organizacion.nombre}
          </p>
          {primerCandidato && (
            <div className="mt-0.5">
              <p className="text-[10px] font-semibold text-gray-700 leading-tight">
                {primerCandidato.nombres} {primerCandidato.apellidoPaterno}
              </p>
              {lista.candidatos[1] && (
                <p className="text-[9px] text-gray-400 leading-tight truncate">
                  N°2: {lista.candidatos[1].nombres} {lista.candidatos[1].apellidoPaterno}
                </p>
              )}
              {primerCandidato.estado === "IMPUGNADO" && (
                <span className="inline-block bg-red-100 text-red-600 text-[8px] font-bold px-1 rounded mt-0.5">
                  IMPUGNADO
                </span>
              )}
            </div>
          )}

          {/* Inputs preferenciales (cuando está seleccionado) */}
          {isSelected && maxPreferenciales > 0 && (
            <div
              className="mt-1.5 border-t border-yellow-200 pt-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[8px] text-gray-400 mb-1 font-medium">
                Pref. opcional — escribe el N° del candidato:
              </p>
              <div className="flex gap-2">
                {Array.from({ length: maxPreferenciales }).map((_, slot) => (
                  <div key={slot} className="flex flex-col items-center gap-0.5">
                    <label className="text-[7px] text-gray-400 font-semibold uppercase">
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
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                      className={`
                        w-12 h-9 text-center text-sm font-black rounded-md border-2
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
                      <span className="text-[8px] text-yellow-700 font-bold">#{prefs[slot]}</span>
                    ) : (
                      <span className="text-[8px] text-gray-300">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Foto del primer candidato */}
        {fotoUrl && (
          <div className="shrink-0 w-12 self-stretch overflow-hidden bg-gray-100 border-l border-gray-100">
            <div className="relative w-full h-full min-h-[64px]">
              <Image
                src={fotoUrl}
                alt={primerCandidato?.nombreCompleto ?? "Candidato"}
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
