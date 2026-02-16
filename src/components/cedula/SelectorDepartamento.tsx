"use client";

import { useRouter } from "next/navigation";

/**
 * 25 departamentos del Perú.
 * Valores en MAYÚSCULAS tal como están en la columna
 * `departamento_postula` de la tabla `candidatos` en Supabase.
 * CALIDAD DE DATOS: mantener mayúsculas y tildes exactas del JNE.
 */
const DEPARTAMENTOS = [
  "AMAZONAS",
  "ÁNCASH",
  "APURÍMAC",
  "AREQUIPA",
  "AYACUCHO",
  "CAJAMARCA",
  "CALLAO",
  "CUSCO",
  "HUANCAVELICA",
  "HUÁNUCO",
  "ICA",
  "JUNÍN",
  "LA LIBERTAD",
  "LAMBAYEQUE",
  "LIMA",
  "LORETO",
  "MADRE DE DIOS",
  "MOQUEGUA",
  "PASCO",
  "PIURA",
  "PUNO",
  "SAN MARTÍN",
  "TACNA",
  "TUMBES",
  "UCAYALI",
] as const;

interface Props {
  departamentoActual?: string;
}

export function SelectorDepartamento({ departamentoActual }: Props) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const dep = e.target.value;
    if (dep) {
      router.push(`/simulador?dep=${encodeURIComponent(dep)}`);
    } else {
      router.push("/simulador");
    }
  }

  const estaSeleccionado = !!departamentoActual;

  return (
    <div
      className={`
        flex flex-col sm:flex-row items-start sm:items-center gap-3
        mb-5 max-w-3xl mx-auto rounded-xl p-3 sm:p-4 border-2 transition-colors
        ${estaSeleccionado
          ? "bg-green-50 border-green-300"
          : "bg-yellow-50 border-yellow-300"
        }
      `}
    >
      {/* Ícono + etiqueta */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
            ${estaSeleccionado ? "bg-green-500 text-white" : "bg-yellow-400 text-gray-800"}
          `}
        >
          {estaSeleccionado ? "✓" : "📍"}
        </div>
        <div className="leading-tight">
          <p className="text-xs font-black text-gray-700 uppercase tracking-wide">
            Circunscripción electoral
          </p>
          <p className="text-[10px] text-gray-500">
            {estaSeleccionado
              ? "Viendo candidatos de tu región"
              : "Necesario para senadores y diputados"}
          </p>
        </div>
      </div>

      {/* Select */}
      <select
        value={departamentoActual ?? ""}
        onChange={handleChange}
        className={`
          w-full sm:flex-1 text-sm border-2 rounded-lg px-3 py-2.5 bg-white
          font-semibold focus:outline-none focus:ring-2
          focus:ring-red-600 focus:border-transparent transition-colors cursor-pointer
          ${estaSeleccionado
            ? "border-green-300 text-green-800"
            : "border-gray-300 text-gray-800"
          }
        `}
      >
        <option value="">— Elige tu departamento —</option>
        {DEPARTAMENTOS.map((dep) => (
          <option key={dep} value={dep}>
            {dep}
          </option>
        ))}
      </select>

      {/* Badge de confirmación */}
      {estaSeleccionado && (
        <span className="hidden sm:inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 border border-green-200">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          Seleccionado
        </span>
      )}

      {/* Aviso móvil sin selección */}
      {!estaSeleccionado && (
        <p className="text-xs text-yellow-700 sm:hidden leading-relaxed">
          Selecciona para ver los candidatos de{" "}
          <strong>Senadores Regionales</strong> y{" "}
          <strong>Diputados</strong> de tu zona.
        </p>
      )}
    </div>
  );
}
