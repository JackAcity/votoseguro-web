"use client";

interface MarcaVotoProps {
  seleccionado: boolean;
  onClick: () => void;
  colorPartido?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MarcaVoto({
  seleccionado,
  onClick,
  colorPartido = "#000000",
  size = "md",
  className = "",
}: MarcaVotoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-lg",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-3xl",
  };

  return (
    <button
      onClick={onClick}
      type="button"
      aria-pressed={seleccionado}
      aria-label={seleccionado ? "Deseleccionar" : "Seleccionar"}
      className={`
        ${sizeClasses[size]}
        border-2 flex items-center justify-center shrink-0
        transition-all duration-150 cursor-pointer active:scale-95
        rounded-sm font-bold relative overflow-hidden
        ${seleccionado
          ? "border-gray-700 bg-white shadow-sm"
          : "border-gray-400 bg-white hover:border-gray-500 hover:bg-gray-50"
        }
        ${className}
      `}
      style={seleccionado ? { color: colorPartido } : {}}
    >
      {seleccionado ? (
        <span
          className="select-none leading-none marca-aspa"
          style={{ color: colorPartido, fontFamily: "serif" }}
        >
          ✗
        </span>
      ) : (
        /* Guía visual del recuadro vacío */
        <span className="text-gray-200 text-xs select-none leading-none">
          +
        </span>
      )}
    </button>
  );
}
