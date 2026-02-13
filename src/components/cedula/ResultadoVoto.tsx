"use client";

import type { ResultadoCedula, VotoCedula } from "@/lib/types";
import { REGLAS_VOTO } from "@/lib/cedula-logic";
import type { DatosSimulador } from "@/lib/types";

interface ResultadoVotoProps {
  resultado: ResultadoCedula;
  voto: VotoCedula;
  datos: DatosSimulador;
  onReintentar: () => void;
}

const ESTADO_CONFIG = {
  valido: {
    emoji: "✅",
    color: "bg-green-50 border-green-400",
    titleColor: "text-green-700",
    badgeColor: "bg-green-100 text-green-800",
    label: "VOTO VÁLIDO",
  },
  nulo: {
    emoji: "❌",
    color: "bg-red-50 border-red-400",
    titleColor: "text-red-700",
    badgeColor: "bg-red-100 text-red-800",
    label: "VOTO NULO (EN ALGUNAS COLUMNAS)",
  },
  blanco: {
    emoji: "⬜",
    color: "bg-gray-50 border-gray-400",
    titleColor: "text-gray-700",
    badgeColor: "bg-gray-100 text-gray-800",
    label: "VOTO EN BLANCO",
  },
  impugnado: {
    emoji: "⚠️",
    color: "bg-yellow-50 border-yellow-400",
    titleColor: "text-yellow-700",
    badgeColor: "bg-yellow-100 text-yellow-800",
    label: "VOTO IMPUGNADO",
  },
};

export function ResultadoVoto({
  resultado,
  voto,
  datos,
  onReintentar,
}: ResultadoVotoProps) {
  const config = ESTADO_CONFIG[resultado.estado];

  // Obtener nombre del partido presidencial seleccionado
  const partidoPresidencial = voto.formulaPresidencial
    ? datos.formulasPresidenciales.find((f) => f.id === voto.formulaPresidencial)
    : null;

  const candidatoPresidencial = partidoPresidencial?.presidente;

  return (
    <div className={`rounded-lg border-2 p-4 ${config.color}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <span className={`font-black text-lg uppercase ${config.titleColor}`}>
            {config.label}
          </span>
          <p className="text-sm text-gray-600 mt-0.5">{resultado.resumen}</p>
        </div>
      </div>

      {/* Resumen de selecciones */}
      <div className="bg-white rounded border border-gray-200 p-3 mb-3">
        <h4 className="text-sm font-bold text-gray-700 mb-2">Tu voto simulado:</h4>

        {voto.formulaPresidencial && candidatoPresidencial && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-mono">
              Presidente
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {candidatoPresidencial.nombres} {candidatoPresidencial.apellidoPaterno}
            </span>
            <span className="text-xs text-gray-500">
              ({partidoPresidencial?.organizacion.sigla})
            </span>
          </div>
        )}

        {[
          { key: "senadorNacional", label: "Sen. Nacional", datos: datos.senadoresNacionales },
          { key: "senadorRegional", label: "Sen. Regional", datos: datos.senadoresRegionales },
          { key: "diputado", label: "Diputados", datos: datos.diputados },
          { key: "parlamentoAndino", label: "Parl. Andino", datos: datos.parlamentoAndino },
        ].map(({ key, label, datos: listaDatos }) => {
          const sel = voto[key as keyof typeof voto] as
            | { idLista: number; preferencias: number[] }
            | undefined;
          if (!sel) return null;

          const lista = listaDatos.find((l) => l.id === sel.idLista);
          const estadoColumna = resultado.columnas[key as keyof typeof resultado.columnas];

          return (
            <div key={key} className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-mono">
                {label}
              </span>
              <span className="text-sm text-gray-700">
                {lista?.organizacion.sigla ?? "?"}
              </span>
              {sel.preferencias.length > 0 && (
                <span className="text-xs text-yellow-700 bg-yellow-100 px-1 rounded">
                  Prefs: {sel.preferencias.join(", ")}
                </span>
              )}
              {estadoColumna?.estado === "nulo" && (
                <span className="text-xs text-red-600 font-bold">⚠ NULO</span>
              )}
            </div>
          );
        })}

        {resultado.estado === "blanco" && (
          <p className="text-sm text-gray-500 italic">
            No seleccionaste ninguna opción.
          </p>
        )}
      </div>

      {/* Motivos de nulo */}
      {resultado.motivos.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
          <h4 className="text-xs font-bold text-red-700 mb-1">
            ¿Por qué fue nulo?
          </h4>
          <ul className="list-disc list-inside space-y-0.5">
            {resultado.motivos.map((m, i) => (
              <li key={i} className="text-xs text-red-600">
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reglas educativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-green-50 border border-green-200 rounded p-2">
          <h5 className="font-bold text-green-700 mb-1">✅ Para que tu voto sea válido:</h5>
          <ul className="space-y-0.5 text-green-800">
            {REGLAS_VOTO.valido.map((r, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="shrink-0">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <h5 className="font-bold text-red-700 mb-1">❌ Tu voto es nulo si:</h5>
          <ul className="space-y-0.5 text-red-800">
            {REGLAS_VOTO.nulo.map((r, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="shrink-0">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botón reintentar */}
      <button
        type="button"
        onClick={onReintentar}
        className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm"
      >
        Volver a simular mi voto
      </button>
    </div>
  );
}
