interface BadgeAntecedenteProps {
  tipo: "CONGRESISTA_ACTUAL" | "EX_CONGRESISTA" | "IMPUGNADO";
  periodo?: string;
}

export function BadgeAntecedente({ tipo, periodo }: BadgeAntecedenteProps) {
  if (tipo === "CONGRESISTA_ACTUAL") {
    return (
      <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
        🏛️ Congresista {periodo ?? "2021-2026"}
      </span>
    );
  }
  if (tipo === "EX_CONGRESISTA") {
    return (
      <span className="inline-flex items-center gap-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
        🏛️ Ex congresista {periodo ?? ""}
      </span>
    );
  }
  if (tipo === "IMPUGNADO") {
    return (
      <span className="inline-flex items-center gap-0.5 bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
        ⚠️ Impugnado
      </span>
    );
  }
  return null;
}
