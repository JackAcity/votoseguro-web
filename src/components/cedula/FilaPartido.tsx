"use client";

import { MarcaVoto } from "./MarcaVoto";
import type { ListaElectoral, SeleccionColumna } from "@/lib/types";

interface FilaPartidoProps {
  lista: ListaElectoral;
  seleccion: SeleccionColumna | undefined;
  onSeleccionarLista: (idLista: number) => void;
  onTogglePreferencial: (numeroCandidato: number) => void;
  maxPreferenciales: number;
  mostrarFormula?: boolean;
}

export function FilaPartido({
  lista,
  seleccion,
  onSeleccionarLista,
  onTogglePreferencial,
  maxPreferenciales,
  mostrarFormula = false,
}: FilaPartidoProps) {
  const isSelected = seleccion?.idLista === lista.id;
  const prefs = seleccion?.preferencias ?? [];
  const { organizacion } = lista;

  return (
    <div
      className={`
        border-b border-gray-300 py-1.5 px-2 transition-colors
        ${isSelected ? "bg-yellow-50 border-yellow-200" : "hover:bg-gray-50"}
      `}
    >
      {/* Fila principal: número, marca, nombre del partido */}
      <div className="flex items-center gap-2">
        {/* Número de lista */}
        <span className="text-xs font-bold text-gray-500 w-4 shrink-0 text-center">
          {organizacion.numeroLista}
        </span>

        {/* Aspa de selección */}
        <MarcaVoto
          seleccionado={isSelected}
          onClick={() => onSeleccionarLista(lista.id)}
          colorPartido={organizacion.colorPrimario}
          size="sm"
        />

        {/* Info del partido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {/* Color badge */}
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: organizacion.colorPrimario }}
            />
            <span className="text-xs font-bold text-gray-800 leading-tight truncate uppercase">
              {organizacion.sigla}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 leading-tight truncate">
            {organizacion.nombre}
          </p>

          {/* Fórmula presidencial */}
          {mostrarFormula && lista.presidente && (
            <div className="mt-0.5">
              <p className="text-[10px] font-semibold text-gray-700 leading-tight">
                {lista.presidente.nombres} {lista.presidente.apellidoPaterno}
              </p>
              {lista.vicepresidente1 && (
                <p className="text-[9px] text-gray-500 leading-tight">
                  VP1: {lista.vicepresidente1.nombres} {lista.vicepresidente1.apellidoPaterno}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Candidatos con voto preferencial (solo si está seleccionado y tiene candidatos) */}
      {isSelected && maxPreferenciales > 0 && lista.candidatos.length > 0 && (
        <div className="mt-1.5 ml-8 border-t border-yellow-200 pt-1.5">
          <p className="text-[9px] text-gray-500 mb-1">
            Voto preferencial (opcional — máx. {maxPreferenciales}):
          </p>
          <div className="flex flex-col gap-0.5">
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
                    flex items-center gap-1.5 text-left rounded px-1 py-0.5
                    transition-colors text-[10px]
                    ${seleccionado
                      ? "bg-yellow-200 text-gray-800 font-semibold"
                      : puedeAgregar
                      ? "hover:bg-yellow-100 text-gray-600 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  <span
                    className={`
                      w-5 h-5 flex items-center justify-center rounded-sm text-[9px] font-bold shrink-0
                      border
                      ${seleccionado
                        ? "bg-yellow-400 border-yellow-500 text-gray-900"
                        : "bg-white border-gray-300 text-gray-600"
                      }
                    `}
                  >
                    {candidato.numeroCandidato}
                  </span>
                  <span className="leading-tight">
                    {candidato.nombres} {candidato.apellidoPaterno}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
