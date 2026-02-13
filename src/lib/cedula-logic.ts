// ============================================================
// Voto Seguro 2026 — Lógica de Validación de Cédula
// Fuente: Ley Orgánica de Elecciones N° 26859 + ONPE
// ============================================================

import type {
  EstadoVoto,
  SeleccionColumna,
  VotoCedula,
  ResultadoCedula,
  ResultadoColumna,
  ConfigColumna,
  TipoCargo,
} from "./types";

// --- Configuración de preferenciales por cargo ---
// Fuente: ONPE - Elecciones Generales 2026

export const MAX_PREFERENCIALES: Record<TipoCargo, number> = {
  FORMULA_PRESIDENCIAL: 0,
  SENADOR_NACIONAL: 2,    // doble preferencial opcional
  SENADOR_REGIONAL: 1,    // simple preferencial
  DIPUTADO: 2,            // doble preferencial opcional (1 si dist. < 2 escaños)
  PARLAMENTO_ANDINO: 2,   // doble preferencial opcional
};

export const CONFIG_COLUMNAS: ConfigColumna[] = [
  {
    tipo: "FORMULA_PRESIDENCIAL",
    titulo: "Fórmula Presidencial",
    subtitulo: "Presidente y Vicepresidentes",
    maxPreferenciales: 0,
    descripcionVoto: "Marca la fórmula completa con una aspa (✗) o cruz (+)",
  },
  {
    tipo: "SENADOR_NACIONAL",
    titulo: "Senadores Nacionales",
    subtitulo: "Circunscripción Nacional",
    maxPreferenciales: 2,
    descripcionVoto: "Opcional: escribe hasta 2 números de candidatos preferidos",
  },
  {
    tipo: "SENADOR_REGIONAL",
    titulo: "Senadores Regionales",
    subtitulo: "Por tu departamento",
    maxPreferenciales: 1,
    descripcionVoto: "Opcional: escribe el número de 1 candidato preferido",
  },
  {
    tipo: "DIPUTADO",
    titulo: "Diputados",
    subtitulo: "Cámara de Diputados",
    maxPreferenciales: 2,
    descripcionVoto: "Opcional: escribe hasta 2 números de candidatos preferidos",
  },
  {
    tipo: "PARLAMENTO_ANDINO",
    titulo: "Parlamento Andino",
    subtitulo: "Representación Internacional",
    maxPreferenciales: 2,
    descripcionVoto: "Opcional: escribe hasta 2 números de candidatos preferidos",
  },
];

// --- Validación de una columna individual ---

export function validarColumna(
  sel: SeleccionColumna,
  maxPrefs: number
): ResultadoColumna {
  // Sin preferenciales = siempre válido (el voto preferencial es opcional)
  if (sel.preferencias.length === 0) {
    return { estado: "valido" };
  }

  // Candidato preferencial marcado dos veces = nulo
  if (new Set(sel.preferencias).size !== sel.preferencias.length) {
    return {
      estado: "nulo",
      motivo: "Candidato preferencial marcado dos veces (número duplicado)",
    };
  }

  // Excede el límite de preferenciales = nulo
  if (sel.preferencias.length > maxPrefs) {
    return {
      estado: "nulo",
      motivo: `Se marcaron ${sel.preferencias.length} preferenciales pero el máximo permitido es ${maxPrefs}`,
    };
  }

  // Número preferencial inválido (0 o negativo)
  if (sel.preferencias.some((p) => p <= 0)) {
    return {
      estado: "nulo",
      motivo: "Número de candidato preferencial inválido",
    };
  }

  return { estado: "valido" };
}

// --- Validación completa de la cédula ---

export function validarCedula(voto: VotoCedula): ResultadoCedula {
  const hayAlgunaMarca =
    voto.formulaPresidencial !== undefined ||
    voto.senadorNacional !== undefined ||
    voto.senadorRegional !== undefined ||
    voto.diputado !== undefined ||
    voto.parlamentoAndino !== undefined;

  // Cédula en blanco
  if (!hayAlgunaMarca) {
    return {
      estado: "blanco",
      columnas: {},
      motivos: ["Cédula en blanco — ninguna columna fue marcada"],
      resumen: "Tu cédula está en BLANCO. No has seleccionado ninguna opción.",
    };
  }

  const columnas: ResultadoCedula["columnas"] = {};
  const motivos: string[] = [];

  if (voto.senadorNacional) {
    const r = validarColumna(voto.senadorNacional, MAX_PREFERENCIALES.SENADOR_NACIONAL);
    columnas.senadorNacional = r;
    if (r.motivo) motivos.push(`Senadores Nacionales: ${r.motivo}`);
  }

  if (voto.senadorRegional) {
    const r = validarColumna(voto.senadorRegional, MAX_PREFERENCIALES.SENADOR_REGIONAL);
    columnas.senadorRegional = r;
    if (r.motivo) motivos.push(`Senadores Regionales: ${r.motivo}`);
  }

  if (voto.diputado) {
    const r = validarColumna(voto.diputado, MAX_PREFERENCIALES.DIPUTADO);
    columnas.diputado = r;
    if (r.motivo) motivos.push(`Diputados: ${r.motivo}`);
  }

  if (voto.parlamentoAndino) {
    const r = validarColumna(voto.parlamentoAndino, MAX_PREFERENCIALES.PARLAMENTO_ANDINO);
    columnas.parlamentoAndino = r;
    if (r.motivo) motivos.push(`Parlamento Andino: ${r.motivo}`);
  }

  const tieneNulo = Object.values(columnas).some((c) => c.estado === "nulo");

  if (tieneNulo) {
    return {
      estado: "nulo",
      columnas,
      motivos,
      resumen: generarResumenNulo(columnas, motivos),
    };
  }

  return {
    estado: "valido",
    columnas,
    motivos: [],
    resumen: generarResumenValido(voto),
  };
}

// --- Helpers de resumen ---

function generarResumenNulo(
  columnas: ResultadoCedula["columnas"],
  motivos: string[]
): string {
  const columnasNulas = Object.entries(columnas)
    .filter(([, v]) => v?.estado === "nulo")
    .map(([k]) => NOMBRE_COLUMNA[k as keyof typeof NOMBRE_COLUMNA]);

  return (
    `Tu cédula tiene ${columnasNulas.length} columna(s) NULA(S): ${columnasNulas.join(", ")}. ` +
    `Recuerda: un nulo en una columna NO invalida las demás. ` +
    `Motivos: ${motivos.join("; ")}.`
  );
}

function generarResumenValido(voto: VotoCedula): string {
  const columnasMarcadas: string[] = [];
  if (voto.formulaPresidencial) columnasMarcadas.push("Fórmula Presidencial");
  if (voto.senadorNacional) columnasMarcadas.push("Senadores Nacionales");
  if (voto.senadorRegional) columnasMarcadas.push("Senadores Regionales");
  if (voto.diputado) columnasMarcadas.push("Diputados");
  if (voto.parlamentoAndino) columnasMarcadas.push("Parlamento Andino");

  return (
    `¡Tu voto es VÁLIDO! Marcaste ${columnasMarcadas.length} columna(s): ` +
    `${columnasMarcadas.join(", ")}. ` +
    `Recuerda que puedes votar por distintos partidos en cada columna (voto cruzado).`
  );
}

const NOMBRE_COLUMNA: Record<string, string> = {
  senadorNacional: "Senadores Nacionales",
  senadorRegional: "Senadores Regionales",
  diputado: "Diputados",
  parlamentoAndino: "Parlamento Andino",
};

// --- Reglas educativas para mostrar al usuario ---

export const REGLAS_VOTO = {
  valido: [
    "Marca con aspa (✗) o cruz (+) dentro del recuadro del partido",
    "La intersección de las líneas debe quedar DENTRO del recuadro",
    "Puedes votar por distintos partidos en cada columna (voto cruzado permitido)",
    "El voto preferencial es OPCIONAL — puedes no escribir ningún número",
  ],
  nulo: [
    "Usar palomita (✓), círculo u otro símbolo diferente a aspa o cruz",
    "La intersección queda FUERA del recuadro del partido",
    "Escribir más números preferenciales de los permitidos",
    "Repetir el mismo número preferencial",
    "Agregar frases, dibujos o tachaduras a la cédula",
    "Escribir números fuera de los recuadros designados para preferenciales",
  ],
  valla: {
    porcentaje: 5,
    descripcion: "Un partido debe obtener al menos 5% de votos válidos nacionales",
    alianza: "Las alianzas necesitan 5% + 1% adicional por cada partido (ej: 2 partidos = 6%)",
    minimosDiputados: 7,
    minimosSenadores: 3,
  },
} as const;
