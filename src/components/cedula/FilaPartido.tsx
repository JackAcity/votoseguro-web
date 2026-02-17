"use client";

import Image from "next/image";
import { MarcaVoto } from "./MarcaVoto";
import { getLogoPartido } from "@/lib/partidos-logos";
import type { ListaElectoral, SeleccionColumna } from "@/lib/types";

interface FilaPartidoProps {
  lista: ListaElectoral;
  seleccion: SeleccionColumna | undefined;
  onSeleccionarLista: (idLista: number) => void;
  onTogglePreferencial: (numeroCandidato: number) => void;
  maxPreferenciales: number;
  mostrarFormula?: boolean;
  accentColor?: string;
}

export function FilaPartido({
  lista,
  seleccion,
  onSeleccionarLista,
  onTogglePreferencial,
  maxPreferenciales,
  mostrarFormula = false,
  accentColor = "border-l-red-700",
}: FilaPartidoProps) {
  const isSelected = seleccion?.idLista === lista.id;
  const prefs = seleccion?.preferencias ?? [];
  const { organizacion } = lista;
  const logoUrl = getLogoPartido(organizacion.id);

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

      {/* Candidatos con voto preferencial */}
      {isSelected && maxPreferenciales > 0 && lista.candidatos.length > 0 && (
        <div className="mt-2 ml-8 border-t border-yellow-200 pt-1.5">
          <p className="text-[9px] text-gray-400 mb-1.5 font-medium">
            Voto preferencial — opcional (máx. {maxPreferenciales}):
          </p>
          <div className="flex flex-col gap-1">
            {lista.candidatos.slice(0, 8).map((candidato) => {
              const seleccionado = prefs.includes(candidato.numeroCandidato);
              const puedeAgregar = prefs.length < maxPreferenciales || seleccionado;

              return (
                <button
                  key={candidato.idHojaVida}
                  type="button"
                  onClick={() => onTogglePreferencial(candidato.numeroCandidato)}
                  disabled={!puedeAgregar && !seleccionado}
                  aria-pressed={seleccionado}
                  className={`
                    flex items-center gap-2 text-left rounded-md px-2 py-1.5
                    transition-colors text-[11px] min-h-[40px]
                    ${seleccionado
                      ? "bg-yellow-200 text-gray-800 font-semibold border border-yellow-300"
                      : puedeAgregar
                      ? "hover:bg-yellow-100 text-gray-600 cursor-pointer border border-transparent hover:border-yellow-200"
                      : "text-gray-300 cursor-not-allowed border border-transparent"
                    }
                  `}
                >
                  <span
                    className={`
                      w-6 h-6 flex items-center justify-center rounded text-[10px] font-black shrink-0
                      border-2
                      ${seleccionado
                        ? "bg-yellow-400 border-yellow-500 text-gray-900"
                        : puedeAgregar
                        ? "bg-white border-gray-300 text-gray-600"
                        : "bg-gray-100 border-gray-200 text-gray-300"
                      }
                    `}
                  >
                    {candidato.numeroCandidato}
                  </span>
                  <span className="leading-tight line-clamp-2 flex-1">
                    {candidato.nombres} {candidato.apellidoPaterno}
                  </span>
                  {seleccionado && (
                    <span className="text-green-600 text-xs shrink-0">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
