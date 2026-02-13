"use client";

import { useState } from "react";
import { ColumnaElectoral } from "./ColumnaElectoral";
import { ResultadoVoto } from "./ResultadoVoto";
import { useCedula } from "@/hooks/useCedula";
import { CONFIG_COLUMNAS } from "@/lib/cedula-logic";
import { DATOS_SIMULADOR } from "@/lib/mock-data";
import type { VotoCedula } from "@/lib/types";

const DATOS = DATOS_SIMULADOR;

type ColumnaKey = keyof Omit<VotoCedula, "formulaPresidencial">;

const COLUMNA_DATOS: Record<ColumnaKey, typeof DATOS.senadoresNacionales> = {
  senadorNacional: DATOS.senadoresNacionales,
  senadorRegional: DATOS.senadoresRegionales,
  diputado: DATOS.diputados,
  parlamentoAndino: DATOS.parlamentoAndino,
};

const COLUMNA_CONFIG_MAP: Record<ColumnaKey, (typeof CONFIG_COLUMNAS)[number]> = {
  senadorNacional: CONFIG_COLUMNAS[1],
  senadorRegional: CONFIG_COLUMNAS[2],
  diputado: CONFIG_COLUMNAS[3],
  parlamentoAndino: CONFIG_COLUMNAS[4],
};

export function CedulaSimulador() {
  const {
    voto,
    resultado,
    seleccionarFormula,
    seleccionarLista,
    togglePreferencial,
    resetear,
    validar,
  } = useCedula();

  const [mostrarResultado, setMostrarResultado] = useState(false);

  const handleValidar = () => {
    validar();
    setMostrarResultado(true);
    // Scroll al resultado
    setTimeout(() => {
      document.getElementById("resultado-voto")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleReintentar = () => {
    resetear();
    setMostrarResultado(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hayAlgunaSeleccion =
    voto.formulaPresidencial !== undefined ||
    voto.senadorNacional !== undefined ||
    voto.senadorRegional !== undefined ||
    voto.diputado !== undefined ||
    voto.parlamentoAndino !== undefined;

  return (
    <div className="max-w-full">
      {/* Header de la cédula */}
      <div className="bg-white border border-gray-400 rounded-t-lg mb-0">
        <div className="bg-red-700 text-white text-center py-2 rounded-t-lg">
          <h2 className="text-sm font-black uppercase tracking-widest">
            REPÚBLICA DEL PERÚ
          </h2>
          <p className="text-xs text-red-200">
            OFICINA NACIONAL DE PROCESOS ELECTORALES — ONPE
          </p>
        </div>
        <div className="bg-gray-100 text-center py-1.5 border-b border-gray-300">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            CÉDULA DE SUFRAGIO — ELECCIONES GENERALES 2026
          </p>
          <p className="text-[10px] text-gray-500">
            Simulador educativo — No es cédula oficial
          </p>
        </div>
      </div>

      {/* Grid de 5 columnas — la cédula */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-t-0 border-gray-400 rounded-b-lg overflow-hidden">
        {/* Columna 1: Fórmula Presidencial */}
        <ColumnaElectoral
          config={CONFIG_COLUMNAS[0]}
          listas={DATOS.formulasPresidenciales}
          seleccion={voto.formulaPresidencial}
          onSeleccionarLista={seleccionarFormula}
          esFormula={true}
        />

        {/* Columnas 2-5: Senadores, Diputados, Parlamento */}
        {(
          [
            "senadorNacional",
            "senadorRegional",
            "diputado",
            "parlamentoAndino",
          ] as ColumnaKey[]
        ).map((columnaKey) => (
          <ColumnaElectoral
            key={columnaKey}
            config={COLUMNA_CONFIG_MAP[columnaKey]}
            listas={COLUMNA_DATOS[columnaKey]}
            seleccion={voto[columnaKey]}
            onSeleccionarLista={(idLista) => seleccionarLista(columnaKey, idLista)}
            onTogglePreferencial={(num) =>
              togglePreferencial(
                columnaKey,
                num,
                COLUMNA_CONFIG_MAP[columnaKey].maxPreferenciales
              )
            }
            esFormula={false}
          />
        ))}
      </div>

      {/* Nota legal */}
      <p className="text-[10px] text-gray-400 text-center mt-2">
        ⚠ Este es un simulador educativo. Los datos de candidatos son referenciales.
        La cédula oficial es emitida exclusivamente por la ONPE.
      </p>

      {/* Botones de acción */}
      <div className="flex gap-3 mt-4 justify-center">
        <button
          type="button"
          onClick={handleValidar}
          className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors shadow-md"
        >
          Verificar mi voto →
        </button>
        {hayAlgunaSeleccion && (
          <button
            type="button"
            onClick={handleReintentar}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg text-sm transition-colors"
          >
            Borrar todo
          </button>
        )}
      </div>

      {/* Resultado */}
      {mostrarResultado && resultado && (
        <div id="resultado-voto" className="mt-6">
          <ResultadoVoto
            resultado={resultado}
            voto={voto}
            datos={DATOS}
            onReintentar={handleReintentar}
          />
        </div>
      )}
    </div>
  );
}
