"use client";

import { FilaPartido } from "./FilaPartido";
import type {
  ListaElectoral,
  SeleccionColumna,
  VotoCedula,
  ConfigColumna,
} from "@/lib/types";

interface ColumnaElectoralProps {
  config: ConfigColumna;
  listas: ListaElectoral[];
  seleccion: SeleccionColumna | number | undefined;
  onSeleccionarLista: (idLista: number) => void;
  className?: string;
  onTogglePreferencial?: (numeroCandidato: number) => void;
  esFormula?: boolean;
}

export function ColumnaElectoral({
  config,
  listas,
  seleccion,
  onSeleccionarLista,
  onTogglePreferencial,
  esFormula = false,
  className = "",
}: ColumnaElectoralProps) {
  const seleccionColumna = esFormula
    ? undefined
    : (seleccion as SeleccionColumna | undefined);
  const seleccionFormula = esFormula ? (seleccion as number | undefined) : undefined;

  return (
    <div className={`flex flex-col border border-gray-400 bg-white min-w-0 ${className}`}>
      {/* Encabezado de columna */}
      <div className="bg-gray-800 text-white px-2 py-1.5 text-center">
        <h3 className="text-[11px] font-bold uppercase leading-tight tracking-wide">
          {config.titulo}
        </h3>
        <p className="text-[9px] text-gray-300 leading-tight mt-0.5">
          {config.subtitulo}
        </p>
        {config.maxPreferenciales > 0 && (
          <span className="inline-block mt-1 bg-yellow-400 text-gray-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
            Hasta {config.maxPreferenciales} preferencial
            {config.maxPreferenciales > 1 ? "es" : ""}
          </span>
        )}
      </div>

      {/* Instrucción */}
      <div className="bg-gray-100 px-2 py-1 border-b border-gray-300">
        <p className="text-[9px] text-gray-600 text-center leading-tight">
          {config.descripcionVoto}
        </p>
      </div>

      {/* Lista de partidos */}
      <div className="flex-1 overflow-y-auto">
        {listas.map((lista) => {
          if (esFormula) {
            // Columna de fórmula presidencial: selección simple
            const isSelected = seleccionFormula === lista.id;
            return (
              <div
                key={lista.id}
                className={`
                  border-b border-gray-300 py-2 px-2 transition-colors cursor-pointer
                  ${isSelected ? "bg-yellow-50 border-l-2 border-l-yellow-400" : "hover:bg-gray-50"}
                `}
                onClick={() => onSeleccionarLista(lista.id)}
              >
                <div className="flex items-start gap-2">
                  {/* Casilla de voto */}
                  <div
                    className={`
                      w-7 h-7 border-2 flex items-center justify-center shrink-0 rounded-sm mt-0.5
                      ${isSelected ? "border-gray-800 bg-white" : "border-gray-400 bg-white"}
                    `}
                  >
                    {isSelected && (
                      <span className="text-lg font-black select-none text-gray-900 leading-none">
                        ✗
                      </span>
                    )}
                  </div>

                  {/* Foto del presidente */}
                  {lista.presidente?.fotoUrl ? (
                    <div className="shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lista.presidente.fotoUrl}
                        alt={`Foto de ${lista.presidente.nombres} ${lista.presidente.apellidoPaterno}`}
                        width={36}
                        height={44}
                        className="w-9 h-11 object-cover object-top rounded-sm border border-gray-200 bg-gray-100"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-11 shrink-0 bg-gray-100 rounded-sm border border-gray-200 flex items-center justify-center">
                      <span className="text-gray-300 text-lg">👤</span>
                    </div>
                  )}

                  {/* Datos del partido y candidato */}
                  <div className="flex-1 min-w-0">
                    {/* Sigla + color */}
                    <div className="flex items-center gap-1 mb-0.5">
                      <div
                        className="w-2 h-2 rounded-sm shrink-0"
                        style={{ backgroundColor: lista.organizacion.colorPrimario }}
                      />
                      <span className="text-[10px] font-black text-gray-800 uppercase leading-tight">
                        {lista.organizacion.sigla}
                      </span>
                    </div>
                    {/* Nombre completo del partido */}
                    <p className="text-[8px] text-gray-400 leading-tight mb-0.5 truncate">
                      {lista.organizacion.nombre}
                    </p>

                    {lista.presidente && (
                      <>
                        <p className="text-[10px] font-bold text-gray-800 leading-tight">
                          {lista.presidente.nombres}{" "}
                          {lista.presidente.apellidoPaterno}
                        </p>
                        {lista.vicepresidente1 && (
                          <p className="text-[8px] text-gray-500 leading-tight">
                            VP1: {lista.vicepresidente1.apellidoPaterno}
                          </p>
                        )}
                        {lista.vicepresidente2 && (
                          <p className="text-[8px] text-gray-500 leading-tight">
                            VP2: {lista.vicepresidente2.apellidoPaterno}
                          </p>
                        )}
                        {lista.presidente.estado === "IMPUGNADO" && (
                          <span className="inline-block bg-red-100 text-red-600 text-[8px] font-bold px-1 rounded mt-0.5">
                            IMPUGNADO
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Columnas con voto preferencial
          return (
            <FilaPartido
              key={lista.id}
              lista={lista}
              seleccion={seleccionColumna}
              onSeleccionarLista={onSeleccionarLista}
              onTogglePreferencial={(num) => onTogglePreferencial?.(num)}
              maxPreferenciales={config.maxPreferenciales}
              mostrarFormula={false}
            />
          );
        })}
      </div>
    </div>
  );
}
