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

  const sinDepartamento = !departamentoActual;

  return (
    <div
      className={`
        flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-5
        max-w-3xl mx-auto rounded-xl p-3 border
        ${sinDepartamento
          ? "bg-red-50 border-red-300 animate-pulse-once"
          : "bg-green-50 border-green-300"
        }
      `}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-lg">{sinDepartamento ? "📍" : "✅"}</span>
        <span className={`text-sm font-bold ${sinDepartamento ? "text-red-700" : "text-green-700"}`}>
          {sinDepartamento ? "Paso 1: Elige tu departamento" : departamentoActual}
        </span>
      </div>
      <select
        value={departamentoActual ?? ""}
        onChange={handleChange}
        className={`
          w-full sm:w-auto flex-1 text-sm rounded-lg px-3 py-2 bg-white
          focus:outline-none focus:ring-2 focus:border-transparent
          ${sinDepartamento
            ? "border-2 border-red-400 text-gray-700 focus:ring-red-500"
            : "border border-green-300 text-gray-800 focus:ring-green-500"
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
      {sinDepartamento && (
        <p className="text-xs text-red-600 font-medium">
          Necesario para ver Senadores Regionales y Diputados de tu circunscripción
        </p>
      )}
    </div>
  );
}
