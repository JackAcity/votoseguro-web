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
  const [copiado, setCopiado] = useState(false);

  // Construir texto para compartir
  const buildShareText = () => {
    const partido = voto.formulaPresidencial
      ? datos.formulasPresidenciales.find(f => f.id === voto.formulaPresidencial)?.organizacion.sigla
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

    // Web Share API — nativa en móvil (WhatsApp, Telegram, etc.)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Voto Seguro 2026 — Simulé mi voto",
          text,
          url,
        });
        return;
      } catch {
        // Usuario canceló el share — no hacer nada
        return;
      }
    }

    // Fallback desktop: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(text);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Fallback final: abrir WhatsApp Web
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // Obtener nombre del partido presidencial seleccionado
  const partidoPresidencial = voto.formulaPresidencial
    ? datos.formulasPresidenciales.find((f) => f.id === voto.formulaPresidencial)
    : null;

  const candidatoPresidencial = partidoPresidencial?.presidente;

  return (
    <div className={`rounded-lg border-2 p-4 ${config.color}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
        <span className="text-3xl leading-none">{config.emoji}</span>
        <div>
          <span className={`font-black text-base sm:text-lg uppercase ${config.titleColor}`}>
            {config.label}
          </span>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">{resultado.resumen}</p>
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

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Compartir — Web Share API en móvil, clipboard en desktop */}
        <button
          type="button"
          onClick={handleCompartir}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm min-h-[44px]"
        >
          {copiado ? (
            <>✅ <span>¡Copiado al portapapeles!</span></>
          ) : (
            <>📤 <span>Compartir mi resultado</span></>
          )}
        </button>

        {/* WhatsApp directo — siempre disponible */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(buildShareText())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm min-h-[44px] sm:w-auto"
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
          className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm min-h-[44px]"
        >
          🔄 Volver a simular
        </button>
      </div>
    </div>
  );
}
