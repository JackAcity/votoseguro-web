"use client";

import { useState } from "react";
import Image from "next/image";
import { FilaCandidato } from "./FilaCandidato";
import { getLogoPartido } from "@/lib/partidos-logos";
import type { ListaElectoral } from "@/lib/types";

interface PartidoAccordionProps {
  lista: ListaElectoral;
  esFormula?: boolean;
  defaultOpen?: boolean;
}

export function PartidoAccordion({ lista, esFormula = false, defaultOpen = false }: PartidoAccordionProps) {
  const [abierto, setAbierto] = useState(defaultOpen);
  const logoUrl = getLogoPartido(lista.organizacion.id);
  const totalCandidatos = lista.candidatos.length;

  // Para fórmula presidencial mostrar president + VPs en orden
  const candidatosOrdenados = esFormula
    ? lista.candidatos.slice().sort((a, b) => a.numeroCandidato - b.numeroCandidato)
    : lista.candidatos.slice().sort((a, b) => a.numeroCandidato - b.numeroCandidato);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header del partido */}
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
        aria-expanded={abierto}
      >
        {/* Número de lista */}
        <div className="shrink-0 w-6 h-6 rounded-full bg-gray-800 text-white text-[9px] font-black flex items-center justify-center leading-none">
          {lista.organizacion.numeroLista}
        </div>

        {/* Logo */}
        <div className="shrink-0 w-10 h-10 border border-gray-200 rounded-sm overflow-hidden bg-white flex items-center justify-center">
          {logoUrl ? (
            <div className="relative w-10 h-10">
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
              className="w-10 h-10 flex items-center justify-center"
              style={{ backgroundColor: lista.organizacion.colorPrimario + "22" }}
            >
              <span className="text-[8px] font-black text-gray-600 text-center leading-tight px-0.5">
                {lista.organizacion.sigla.slice(0, 4)}
              </span>
            </div>
          )}
        </div>

        {/* Nombre del partido */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800 uppercase leading-tight">
            {lista.organizacion.nombre}
          </p>
          {esFormula && lista.presidente && (
            <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
              {lista.presidente.nombres} {lista.presidente.apellidoPaterno}
            </p>
          )}
          {!esFormula && (
            <p className="text-[9px] text-gray-400 leading-tight mt-0.5">
              {totalCandidatos} candidatos
            </p>
          )}
        </div>

        {/* Chevron */}
        <span className="shrink-0 text-gray-400 text-sm transition-transform duration-200" style={{ transform: abierto ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▼
        </span>
      </button>

      {/* Lista de candidatos */}
      {abierto && (
        <div className="border-t border-gray-200 bg-white">
          {candidatosOrdenados.map((candidato) => (
            <FilaCandidato
              key={candidato.idHojaVida || candidato.numeroCandidato}
              candidato={candidato}
              posicion={candidato.numeroCandidato}
              esPresidencial={esFormula && candidato.numeroCandidato === 1}
            />
          ))}
          {candidatosOrdenados.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-gray-400">
              No hay candidatos registrados para esta lista.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
