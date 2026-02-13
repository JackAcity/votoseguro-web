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
}: ColumnaElectoralProps) {
  const seleccionColumna = esFormula
    ? undefined
    : (seleccion as SeleccionColumna | undefined);
  const seleccionFormula = esFormula ? (seleccion as number | undefined) : undefined;

  return (
    <div className="flex flex-col border border-gray-400 bg-white min-w-0">
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
                  border-b border-gray-300 py-1.5 px-2 transition-colors cursor-pointer
                  ${isSelected ? "bg-yellow-50" : "hover:bg-gray-50"}
                `}
                onClick={() => onSeleccionarLista(lista.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 w-4 shrink-0 text-center">
                    {lista.organizacion.numeroLista}
                  </span>
                  <div
                    className={`
                      w-8 h-8 border-2 flex items-center justify-center shrink-0 rounded-sm
                      ${isSelected ? "border-gray-800 bg-white" : "border-gray-400 bg-white"}
                    `}
                  >
                    {isSelected && (
                      <span
                        className="text-xl font-bold select-none"
                        style={{ color: lista.organizacion.colorPrimario }}
                      >
                        ✗
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: lista.organizacion.colorPrimario }}
                      />
                      <span className="text-xs font-bold text-gray-800 truncate uppercase">
                        {lista.organizacion.sigla}
                      </span>
                    </div>
                    {lista.presidente && (
                      <div className="mt-0.5">
                        <p className="text-[10px] font-semibold text-gray-800 leading-tight">
                          {lista.presidente.nombres}{" "}
                          {lista.presidente.apellidoPaterno}
                        </p>
                        {lista.vicepresidente1 && (
                          <p className="text-[9px] text-gray-500 leading-tight">
                            {lista.vicepresidente1.nombres}{" "}
                            {lista.vicepresidente1.apellidoPaterno}
                          </p>
                        )}
                        {lista.vicepresidente2 && (
                          <p className="text-[9px] text-gray-500 leading-tight">
                            {lista.vicepresidente2.nombres}{" "}
                            {lista.vicepresidente2.apellidoPaterno}
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
