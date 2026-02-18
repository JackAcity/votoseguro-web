/**
 * Servicio de candidatos — lee datos estáticos generados desde Supabase.
 *
 * Datos generados con: node scripts/generate-static-data.mjs
 * Fuente: Supabase (8,217 candidatos) — proceso 124 (EG 2026)
 *
 * IDs de cargo:
 *   1  → PRESIDENTE DE LA REPÚBLICA
 *   2  → PRIMER VICEPRESIDENTE
 *   3  → SEGUNDO VICEPRESIDENTE
 *   5  → REPRESENTANTE ANTE EL PARLAMENTO ANDINO
 *   15 → DIPUTADO
 *   16 → SENADOR
 *
 * Distinción senador nacional vs regional:
 *   strUbigeo === "000000" → nacional
 *   strUbigeo !== "000000" → regional (filtrar por strDepartamento)
 *
 * Foto: https://mpesije.jne.gob.pe/apidocs/{strGuidFoto}.jpeg
 */

import type {
  DatosSimulador,
  ListaElectoral,
  Candidato,
  OrganizacionPolitica,
  TipoCargo,
} from "@/lib/types";

// Datos estáticos generados desde Supabase (build time)
import candidatosData from "@/data/candidatos-eg2026.json";

// ──────────────────────────────────────────────────────────────────────────────
// Configuración
// ──────────────────────────────────────────────────────────────────────────────

const JNE_FOTO_BASE = "https://mpesije.jne.gob.pe/apidocs";

const ID_PROCESO = 124;

const ID_CARGO = {
  PRESIDENTE: 1,
  VP1: 2,
  VP2: 3,
  PARLAMENTO_ANDINO: 5,
  DIPUTADO: 15,
  SENADOR: 16,
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// Orden oficial ONPE — Sorteo 12-feb-2026
// (mismo que antes, sin cambios)
// ──────────────────────────────────────────────────────────────────────────────
const ORDEN_ONPE: Record<number, number> = {
  3025: 1,   // Alianza Electoral Venceremos
  2869: 2,   // Partido Patriótico del Perú
  2941: 3,   // Partido Cívico Obras
  2901: 4,   // FREPAP
  2895: 5,   // Partido Demócrata Verde
  2961: 6,   // Partido del Buen Gobierno
  2932: 7,   // Partido Político Perú Acción
  2921: 8,   // Partido Político PRIN
  2967: 9,   // Partido Político Progresemos
  2935: 10,  // Partido Sí Creo
  2956: 11,  // Partido País para Todos
  2857: 12,  // Frente de la Esperanza 2021
  2218: 13,  // Partido Político Nacional Perú Libre
  // 2968: 14 — excluido JNE
  2931: 15,  // Primero la Gente
  1264: 16,  // Partido Juntos Por el Perú
  2731: 17,  // Partido Político Podemos Perú
  2986: 18,  // Partido Democrático Federal
  2898: 19,  // Partido Fe en el Perú
  2985: 20,  // Partido Político Integridad Democrática
  1366: 21,  // Fuerza Popular
  1257: 22,  // Alianza para el Progreso
  2995: 23,  // Partido Político Cooperación Popular
  2980: 24,  // Ahora Nación
  2933: 25,  // Libertad Popular
  2998: 26,  // Un Camino Diferente
  2173: 27,  // Avanza País
  2924: 28,  // Perú Moderno
  2925: 29,  // Partido Político Perú Primero
  2927: 30,  // Salvemos al Perú
  14:   31,  // Partido Democrático Somos Perú
  2930: 32,  // Partido Aprista Peruano
  22:   33,  // Renovación Popular
  2867: 34,  // Partido Demócrata Unido Perú
  3024: 35,  // Fuerza y Libertad
  2939: 36,  // Partido de los Trabajadores y Emprendedores
  3023: 37,  // Unidad Nacional
  2840: 38,  // Partido Morado
};

// ──────────────────────────────────────────────────────────────────────────────
// Tipo interno — estructura de la respuesta JNE
// ──────────────────────────────────────────────────────────────────────────────

interface JNECandidatoRaw {
  idProcesoElectoral: number;
  idOrganizacionPolitica: number;
  strOrganizacionPolitica?: string | null;
  intPosicion?: number | null;
  idCargo: number;
  strCargo?: string | null;
  strNombres?: string | null;
  strApellidoPaterno?: string | null;
  strApellidoMaterno?: string | null;
  strEstadoCandidato?: string | null;
  strGuidFoto?: string | null;
  strNombre?: string | null;    // nombre del archivo foto (para determinar ext)
  strUbigeo?: string | null;
  strDepartamento?: string | null;
  strDocumentoIdentidad?: string | null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/** Normaliza una cadena: mayúsculas + sin diacríticos (ej. "ÁNCASH" → "ANCASH"). */
function normalizarDep(s: string): string {
  return s
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildFotoUrl(guidFoto: string | null | undefined, nombreArchivo: string | null | undefined): string | undefined {
  if (!guidFoto || guidFoto.trim() === "") return undefined;
  // Usar la extensión real del archivo (algunos son .jpg, otros .jpeg)
  const ext = nombreArchivo?.toLowerCase().endsWith(".jpeg") ? "jpeg" : "jpg";
  return `${JNE_FOTO_BASE}/${guidFoto.trim()}.${ext}`;
}

const PALABRAS_EXCLUIDAS = new Set(["DE", "DEL", "LA", "EL", "LOS", "LAS", "Y", "E", "A", "EN", "POR", "PARA"]);

function generarSigla(nombre: string): string {
  const palabras = nombre
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .filter((p) => p.length > 1 && !PALABRAS_EXCLUIDAS.has(p));
  return palabras.slice(0, 4).map((p) => p[0]).join("");
}

function mapOrganizacion(
  idOrg: number,
  nombre: string,
  numeroLista: number
): OrganizacionPolitica {
  return {
    id: idOrg,
    nombre: nombre || "Sin nombre",
    sigla: generarSigla(nombre || ""),
    colorPrimario: "#6B7280",
    numeroLista,
  };
}

function mapCandidato(raw: JNECandidatoRaw, cargo: TipoCargo): Candidato {
  const nombres = raw.strNombres ?? "";
  const ap = raw.strApellidoPaterno ?? "";
  const am = raw.strApellidoMaterno ?? "";
  const idHojaVida =
    raw.strDocumentoIdentidad && /^\d+$/.test(raw.strDocumentoIdentidad.trim())
      ? parseInt(raw.strDocumentoIdentidad.trim(), 10)
      : 0;
  const dni = raw.strDocumentoIdentidad?.trim() || undefined;
  return {
    idHojaVida,
    nombres,
    apellidoPaterno: ap,
    apellidoMaterno: am,
    nombreCompleto: `${nombres} ${ap} ${am}`.replace(/\s+/g, " ").trim(),
    cargo,
    numeroCandidato: raw.intPosicion ?? 0,
    fotoUrl: buildFotoUrl(raw.strGuidFoto, raw.strNombre),
    idOrganizacion: raw.idOrganizacionPolitica,
    estado: (raw.strEstadoCandidato ?? "INSCRITO") as Candidato["estado"],
    departamento: raw.strDepartamento ?? undefined,
    dni,
  };
}

/**
 * Agrupa filas crudas de la API JNE por organización política → ListaElectoral[].
 */
function agruparEnListas(
  rows: JNECandidatoRaw[],
  cargo: TipoCargo,
  mapaNumeros: Map<number, number>
): ListaElectoral[] {
  const mapa = new Map<number, JNECandidatoRaw[]>();
  for (const row of rows) {
    const idOrg = row.idOrganizacionPolitica;
    if (!mapa.has(idOrg)) mapa.set(idOrg, []);
    mapa.get(idOrg)!.push(row);
  }

  const listas: ListaElectoral[] = [];

  for (const [idOrg, candidatosOrg] of mapa) {
    // Ordenar por intPosicion ASC
    candidatosOrg.sort(
      (a, b) => (a.intPosicion ?? 999) - (b.intPosicion ?? 999)
    );

    const primeraFila = candidatosOrg[0];
    const numLista = mapaNumeros.get(idOrg) ?? 999;
    const nombre = primeraFila.strOrganizacionPolitica ?? "Sin nombre";
    const organizacion = mapOrganizacion(idOrg, nombre, numLista);
    const candidatos = candidatosOrg.map((r) => mapCandidato(r, cargo));

    listas.push({ id: idOrg, organizacion, cargo, candidatos });
  }

  // Ordenar por posición ONPE
  listas.sort((a, b) => a.organizacion.numeroLista - b.organizacion.numeroLista);
  return listas;
}

// ──────────────────────────────────────────────────────────────────────────────
// Función principal
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene todos los datos necesarios para el simulador de cédula.
 * Lee del JSON estático generado desde Supabase (sin llamadas externas en runtime).
 *
 * @param departamento - Nombre del departamento en MAYÚSCULAS (ej: "LIMA").
 *   Si es undefined, las columnas regionales devuelven array vacío.
 */
export function getDatosSimulador(
  departamento?: string
): DatosSimulador {
  const rawList = candidatosData as JNECandidatoRaw[];

  // Filtrar solo proceso 124 y no excluidos
  const activos = rawList.filter(
    (r) =>
      r.idProcesoElectoral === ID_PROCESO &&
      r.strEstadoCandidato?.toUpperCase() !== "EXCLUIDO"
  );

  // Separar por cargo
  const presidentes = activos.filter((r) =>
    [ID_CARGO.PRESIDENTE, ID_CARGO.VP1, ID_CARGO.VP2].includes(r.idCargo as 1 | 2 | 3)
  );
  const senadoresNac = activos.filter(
    (r) => r.idCargo === ID_CARGO.SENADOR && r.strUbigeo === "000000"
  );
  const depNorm = departamento ? normalizarDep(departamento) : null;
  const senadoresReg = depNorm
    ? activos.filter(
        (r) =>
          r.idCargo === ID_CARGO.SENADOR &&
          r.strUbigeo !== "000000" &&
          normalizarDep(r.strDepartamento ?? "") === depNorm
      )
    : [];
  const diputados = depNorm
    ? activos.filter(
        (r) =>
          r.idCargo === ID_CARGO.DIPUTADO &&
          normalizarDep(r.strDepartamento ?? "") === depNorm
      )
    : [];
  const parlamento = activos.filter((r) => r.idCargo === ID_CARGO.PARLAMENTO_ANDINO);

  // Construir mapa de números de lista (orden ONPE)
  const idsOrgs = [...new Set(activos.map((r) => r.idOrganizacionPolitica))];
  const mapaNumeros = new Map<number, number>();
  for (const id of idsOrgs) {
    mapaNumeros.set(id, ORDEN_ONPE[id] ?? 999);
  }

  // Construir fórmulas presidenciales
  const mapaFormulas = new Map<number, JNECandidatoRaw[]>();
  for (const row of presidentes) {
    const idOrg = row.idOrganizacionPolitica;
    if (!mapaFormulas.has(idOrg)) mapaFormulas.set(idOrg, []);
    mapaFormulas.get(idOrg)!.push(row);
  }

  const formulasPresidenciales: ListaElectoral[] = [];
  for (const [idOrg, filas] of mapaFormulas) {
    filas.sort((a, b) => (a.intPosicion ?? 999) - (b.intPosicion ?? 999));
    const numLista = mapaNumeros.get(idOrg) ?? 999;
    const nombre = filas[0].strOrganizacionPolitica ?? "Sin nombre";
    const organizacion = mapOrganizacion(idOrg, nombre, numLista);
    const candidatos = filas.map((r) => mapCandidato(r, "FORMULA_PRESIDENCIAL"));
    formulasPresidenciales.push({
      id: idOrg,
      organizacion,
      cargo: "FORMULA_PRESIDENCIAL",
      candidatos,
      presidente: candidatos.find((c) => c.numeroCandidato === 1),
      vicepresidente1: candidatos.find((c) => c.numeroCandidato === 2),
      vicepresidente2: candidatos.find((c) => c.numeroCandidato === 3),
    });
  }
  formulasPresidenciales.sort(
    (a, b) => a.organizacion.numeroLista - b.organizacion.numeroLista
  );

  return {
    formulasPresidenciales,
    senadoresNacionales: agruparEnListas(senadoresNac, "SENADOR_NACIONAL", mapaNumeros),
    senadoresRegionales: agruparEnListas(senadoresReg, "SENADOR_REGIONAL", mapaNumeros),
    diputados: agruparEnListas(diputados, "DIPUTADO", mapaNumeros),
    parlamentoAndino: agruparEnListas(parlamento, "PARLAMENTO_ANDINO", mapaNumeros),
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers para la página /candidatos
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Devuelve la URL de la hoja de vida en el portal JNE (EG 2026).
 * @param dni - DNI del candidato (strDocumentoIdentidad)
 */
export function getHojaVidaUrl(dni: string): string {
  return `https://votoinformado.jne.gob.pe/hoja-vida/22/${dni}`;
}

/**
 * Devuelve las listas electorales para una cargo determinado.
 * Para cargos regionales (SENADOR_REGIONAL, DIPUTADO) se filtra por departamento.
 */
export function getCandidatosPorCargo(
  cargo: TipoCargo,
  departamento?: string
): ListaElectoral[] {
  const datos = getDatosSimulador(departamento);
  switch (cargo) {
    case "FORMULA_PRESIDENCIAL":
      return datos.formulasPresidenciales;
    case "SENADOR_NACIONAL":
      return datos.senadoresNacionales;
    case "SENADOR_REGIONAL":
      return datos.senadoresRegionales;
    case "DIPUTADO":
      return datos.diputados;
    case "PARLAMENTO_ANDINO":
      return datos.parlamentoAndino;
    default:
      return [];
  }
}

/** Devuelve todos los departamentos disponibles en el JSON (únicos, ordenados). */
export function getDepartamentos(): string[] {
  const rawList = candidatosData as JNECandidatoRaw[];
  const deps = new Set<string>();
  for (const r of rawList) {
    if (r.strDepartamento && r.strUbigeo !== "000000") {
      deps.add(r.strDepartamento.trim().toUpperCase());
    }
  }
  return Array.from(deps).sort((a, b) => a.localeCompare(b, "es"));
}
