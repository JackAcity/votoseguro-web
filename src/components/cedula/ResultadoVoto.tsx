"use client";

import { useState } from "react";
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
    icon: "✅",
    bgHero: "bg-gradient-to-br from-green-600 to-green-800",
    bgCard: "bg-green-50 border-green-300",
    titleColor: "text-green-700",
    badgeColor: "bg-green-600 text-white",
    label: "VOTO VÁLIDO",
    mensaje: "Tu voto está correctamente marcado y será contabilizado.",
  },
  nulo: {
    icon: "❌",
    bgHero: "bg-gradient-to-br from-red-600 to-red-800",
    bgCard: "bg-red-50 border-red-300",
    titleColor: "text-red-700",
    badgeColor: "bg-red-600 text-white",
    label: "VOTO CON ERRORES",
    mensaje: "Algunas columnas tienen errores que podrían anular tu voto.",
  },
  blanco: {
    icon: "⬜",
    bgHero: "bg-gradient-to-br from-gray-500 to-gray-700",
    bgCard: "bg-gray-50 border-gray-300",
    titleColor: "text-gray-700",
    badgeColor: "bg-gray-600 text-white",
    label: "VOTO EN BLANCO",
    mensaje: "No seleccionaste ningún partido. El voto blanco es válido pero no cuenta para nadie.",
  },
  impugnado: {
    icon: "⚠️",
    bgHero: "bg-gradient-to-br from-yellow-600 to-yellow-800",
    bgCard: "bg-yellow-50 border-yellow-300",
    titleColor: "text-yellow-700",
    badgeColor: "bg-yellow-600 text-white",
    label: "VOTO IMPUGNADO",
    mensaje: "Seleccionaste un candidato impugnado. Este voto podría ser observado.",
  },
};

export function ResultadoVoto({
  resultado,
  voto,
  datos,
  onReintentar,
}: ResultadoVotoProps) {
  const config = ESTADO_CONFIG[resultado.estado];
  const [copiado, setCopiado] = useState(false);
  const [mostrarReglas, setMostrarReglas] = useState(false);

  const buildShareText = () => {
    const partido = voto.formulaPresidencial
      ? datos.formulasPresidenciales.find((f) => f.id === voto.formulaPresidencial)?.organizacion.sigla
      : null;
    const estadoEmoji = { valido: "✅", nulo: "❌", blanco: "⬜", impugnado: "⚠️" }[resultado.estado];
    const lines = [
      `${estadoEmoji} Simulé mi voto para las Elecciones Perú 2026`,
      partido ? `🗳️ Mi voto presidencial: ${partido}` : "",
      `📊 Estado: ${config.label}`,
      ``,
      `¿Ya simulaste el tuyo? 👇`,
      `https://votoseguro-web.vercel.app/simulador`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const handleCompartir = async () => {
    const text = buildShareText();
    const url = "https://votoseguro-web.vercel.app/simulador";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Voto Seguro 2026 — Simulé mi voto", text, url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const partidoPresidencial = voto.formulaPresidencial
    ? datos.formulasPresidenciales.find((f) => f.id === voto.formulaPresidencial)
    : null;

  return (
    <div className="rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg">

      {/* Hero de resultado */}
      <div className={`${config.bgHero} text-white px-4 py-5 text-center`}>
        <div className="text-4xl mb-2">{config.icon}</div>
        <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-2">
          <span className="font-black text-sm sm:text-base uppercase tracking-wide">
            {config.label}
          </span>
        </div>
        <p className="text-white/80 text-xs sm:text-sm max-w-md mx-auto">
          {config.mensaje}
        </p>
      </div>

      <div className="bg-white p-4">

        {/* Resumen del voto */}
        <div className="mb-4">
          <h4 className="text-sm font-black text-gray-800 mb-2 flex items-center gap-1.5">
            <span className="text-base">📋</span>
            Resumen de tu voto simulado
          </h4>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Presidencial */}
            {(() => {
              const candidato = partidoPresidencial?.presidente;
              const estadoCol = resultado.columnas["formulaPresidencial"];
              const esNulo = estadoCol?.estado === "nulo";
              return (
                <div className={`flex items-center gap-2 px-3 py-2 border-b border-gray-100 ${esNulo ? "bg-red-50" : voto.formulaPresidencial ? "bg-green-50/40" : "bg-gray-50"}`}>
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold shrink-0">
                    Presidente
                  </span>
                  {voto.formulaPresidencial && candidato ? (
                    <span className="text-xs text-gray-700 font-medium flex-1">
                      {candidato.nombres} {candidato.apellidoPaterno}
                      <span className="text-gray-400 ml-1">({partidoPresidencial?.organizacion.sigla})</span>
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic flex-1">Sin marcar</span>
                  )}
                  {esNulo && <span className="text-[10px] text-red-600 font-bold shrink-0">⚠ NULO</span>}
                  {!esNulo && voto.formulaPresidencial && <span className="text-green-500 text-xs shrink-0">✓</span>}
                </div>
              );
            })()}

            {/* Las otras 4 columnas */}
            {[
              { key: "senadorNacional", label: "Sen. Nacional", datos: datos.senadoresNacionales, color: "bg-blue-100 text-blue-700" },
              { key: "senadorRegional", label: "Sen. Regional", datos: datos.senadoresRegionales, color: "bg-green-100 text-green-700" },
              { key: "diputado", label: "Diputados", datos: datos.diputados, color: "bg-purple-100 text-purple-700" },
              { key: "parlamentoAndino", label: "Parl. Andino", datos: datos.parlamentoAndino, color: "bg-yellow-100 text-yellow-700" },
            ].map(({ key, label, datos: listaDatos, color }) => {
              const sel = voto[key as keyof typeof voto] as
                | { idLista: number; preferencias: number[] }
                | undefined;
              const lista = sel ? listaDatos.find((l) => l.id === sel.idLista) : null;
              const estadoColumna = resultado.columnas[key as keyof typeof resultado.columnas];
              const esNulo = estadoColumna?.estado === "nulo";
              const isLast = key === "parlamentoAndino";

              return (
                <div
                  key={key}
                  className={`flex items-center gap-2 px-3 py-2 ${!isLast ? "border-b border-gray-100" : ""} ${
                    esNulo ? "bg-red-50" : sel ? "bg-green-50/40" : "bg-gray-50"
                  }`}
                >
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${color}`}>
                    {label}
                  </span>
                  {sel && lista ? (
                    <span className="text-xs text-gray-700 font-medium flex-1">
                      {lista.organizacion.sigla}
                      {sel.preferencias.length > 0 && (
                        <span className="text-yellow-600 ml-1.5 bg-yellow-100 px-1 rounded text-[9px]">
                          Pref: {sel.preferencias.join(", ")}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic flex-1">Sin marcar</span>
                  )}
                  {esNulo && <span className="text-[10px] text-red-600 font-bold shrink-0">⚠ NULO</span>}
                  {!esNulo && sel && <span className="text-green-500 text-xs shrink-0">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivos de nulo */}
        {resultado.motivos.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <h4 className="text-xs font-black text-red-700 mb-2 flex items-center gap-1.5">
              <span>⚠️</span> ¿Por qué algunas columnas son nulas?
            </h4>
            <ul className="space-y-1">
              {resultado.motivos.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-red-600">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reglas educativas (colapsables) */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setMostrarReglas(!mostrarReglas)}
            className="w-full flex items-center justify-between text-xs font-bold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2.5 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span>📚</span> Ver reglas para votar correctamente
            </span>
            <span className="text-gray-400">{mostrarReglas ? "▲" : "▼"}</span>
          </button>

          {mostrarReglas && (
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h5 className="font-black text-green-700 mb-1.5 flex items-center gap-1">
                  <span>✅</span> Para que tu voto sea válido:
                </h5>
                <ul className="space-y-1 text-green-800">
                  {REGLAS_VOTO.valido.map((r, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="shrink-0">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h5 className="font-black text-red-700 mb-1.5 flex items-center gap-1">
                  <span>❌</span> Tu voto es nulo si:
                </h5>
                <ul className="space-y-1 text-red-800">
                  {REGLAS_VOTO.nulo.map((r, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="shrink-0">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Compartir */}
          <button
            type="button"
            onClick={handleCompartir}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm min-h-[48px]"
          >
            {copiado ? (
              <>✅ <span>¡Copiado!</span></>
            ) : (
              <>📤 <span>Compartir resultado</span></>
            )}
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(buildShareText())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm min-h-[48px]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Volver a simular */}
          <button
            type="button"
            onClick={onReintentar}
            className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm min-h-[48px] flex items-center justify-center gap-1.5"
          >
            <span>🔄</span> Volver a simular
          </button>
        </div>

      </div>
    </div>
  );
}
