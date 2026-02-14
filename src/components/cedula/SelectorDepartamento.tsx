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

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-5 max-w-3xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-3">
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
        📍 Tu circunscripción:
      </span>
      <select
        value={departamentoActual ?? ""}
        onChange={handleChange}
        className="w-full sm:w-auto flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
      >
        <option value="">— Elige tu departamento —</option>
        {DEPARTAMENTOS.map((dep) => (
          <option key={dep} value={dep}>
            {dep}
          </option>
        ))}
      </select>
      {!departamentoActual && (
        <p className="text-xs text-yellow-700 sm:hidden">
          Elige tu departamento para ver los candidatos de Senadores Regionales
          y Diputados de tu circunscripción.
        </p>
      )}
    </div>
  );
}
