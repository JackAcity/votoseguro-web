/**
 * Servicio de candidatos — queries a Supabase para el simulador.
 *
 * CALIDAD DE DATOS:
 * - Los cargos en BD vienen con tildes exactas del JNE (ej: REPÚBLICA, SENADOR).
 *   Usar `.eq()` con el string exacto — NO usar .toUpperCase() ni normalizar.
 * - Los nombres (nombres, apellido_paterno, apellido_materno) preservan
 *   mayúsculas, tildes y ñ tal como vienen del JNE. No transformar.
 * - tx_guid_foto puede ser null → fotoUrl queda undefined.
 * - Senadores nacionales: ubigeo_postula = '000000'
 * - Senadores regionales: ubigeo_postula != '000000' (tienen ubigeo de circunscripción)
 *
 * ESQUEMA REAL DE LA BD (verificado 2026-02-14):
 * - candidatos.organizacion_politica_nombre: nombre completo del partido (ya viene en la fila)
 * - organizaciones_politicas: solo tiene id_organizacion, nombre (sin sigla ni numero_lista)
 * - No hacer join con organizaciones_politicas — usar organizacion_politica_nombre de candidatos
 */

import { createServerClient } from "@/lib/supabase-server";
import type {
  DatosSimulador,
  ListaElectoral,
  Candidato,
  OrganizacionPolitica,
  TipoCargo,
} from "@/lib/types";

// URL base para fotos de candidatos del JNE
const JNE_FOTO_BASE = "https://mpesije.jne.gob.pe/apidocs";

// Valores exactos de la columna `cargo` en la tabla `candidatos` de Supabase.
// IMPORTANTE: contienen tildes originales del JNE — no modificar.
const CARGO = {
  PRESIDENTE: "PRESIDENTE DE LA REPÚBLICA",
  VP1: "PRIMER VICEPRESIDENTE DE LA REPÚBLICA",
  VP2: "SEGUNDO VICEPRESIDENTE DE LA REPÚBLICA",
  SENADOR: "SENADOR",
  DIPUTADO: "DIPUTADO",
  PARLAMENTO_ANDINO: "REPRESENTANTE ANTE EL PARLAMENTO ANDINO",
} as const;

// Proceso electoral activo
const ID_PROCESO = 124;

// ──────────────────────────────────────────────────────────────────────────────
// Tipos internos que mapean la respuesta de Supabase
// ──────────────────────────────────────────────────────────────────────────────

interface CandidatoRow {
  id_hoja_vida: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  cargo: string;
  numero_candidato: number | null;
  tx_guid_foto: string | null;
  estado: string | null;
  departamento_postula: string | null;
  ubigeo_postula: string | null;
  id_organizacion_politica: number | null;
  // Nombre del partido viene directo en candidatos (no requiere join)
  organizacion_politica_nombre: string | null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function fotoUrl(txGuidFoto: string | null | undefined): string | undefined {
  if (!txGuidFoto || txGuidFoto.trim() === "") return undefined;
  return `${JNE_FOTO_BASE}/${txGuidFoto.trim()}.jpg`;
}

/**
 * Genera sigla automática a partir del nombre del partido.
 * Toma la primera letra de cada palabra significativa (>2 chars), máximo 4.
 * Ejemplos:
 *   "FUERZA POPULAR" → "FP"
 *   "ALIANZA PARA EL PROGRESO" → "APP" (omite "EL")
 *   "PARTIDO DEMOCRATICO SOMOS PERU" → "PDSP"
 *
 * Calidad de datos: preserva MAYÚSCULAS del original JNE.
 */
function generarSigla(nombre: string): string {
  const PALABRAS_EXCLUIDAS = new Set(["DE", "DEL", "LA", "EL", "LOS", "LAS", "Y", "E", "A", "EN", "POR", "PARA"]);
  const palabras = nombre
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 1 && !PALABRAS_EXCLUIDAS.has(p));
  return palabras
    .slice(0, 4)
    .map((p) => p[0])
    .join("");
}

function mapCandidato(row: CandidatoRow, cargo: TipoCargo): Candidato {
  // Preservar nombres tal como vienen de BD (tildes, ñ, mayúsculas originales JNE)
  const nombres = row.nombres ?? "";
  const ap = row.apellido_paterno ?? "";
  const am = row.apellido_materno ?? "";
  return {
    idHojaVida: row.id_hoja_vida,
    nombres,
    apellidoPaterno: ap,
    apellidoMaterno: am,
    nombreCompleto: `${nombres} ${ap} ${am}`.replace(/\s+/g, " ").trim(),
    cargo,
    numeroCandidato: row.numero_candidato ?? 0,
    fotoUrl: fotoUrl(row.tx_guid_foto),
    idOrganizacion: row.id_organizacion_politica ?? 0,
    estado: (row.estado ?? "INSCRITO") as Candidato["estado"],
    departamento: row.departamento_postula ?? undefined,
  };
}

function mapOrganizacion(row: CandidatoRow): OrganizacionPolitica {
  const nombre = row.organizacion_politica_nombre ?? "Sin nombre";
  return {
    id: row.id_organizacion_politica ?? 0,
    nombre,
    sigla: generarSigla(nombre),
    colorPrimario: "#6B7280", // neutro — personalizable después
    // numero_lista no está en BD; usar id_organizacion como orden estable
    numeroLista: row.id_organizacion_politica ?? 0,
  };
}

/**
 * Agrupa filas de candidatos por organización política → ListaElectoral[].
 */
function agruparEnListas(
  rows: CandidatoRow[],
  cargo: TipoCargo
): ListaElectoral[] {
  const mapa = new Map<number, CandidatoRow[]>();
  for (const row of rows) {
    const idOrg = row.id_organizacion_politica ?? 0;
    if (!mapa.has(idOrg)) mapa.set(idOrg, []);
    mapa.get(idOrg)!.push(row);
  }

  const listas: ListaElectoral[] = [];

  for (const [, candidatosOrg] of mapa) {
    // Ordenar por numero_candidato ASC (null al final)
    candidatosOrg.sort(
      (a, b) => (a.numero_candidato ?? 999) - (b.numero_candidato ?? 999)
    );

    const primeraFila = candidatosOrg[0];
    if (!primeraFila.id_organizacion_politica) continue;

    const organizacion = mapOrganizacion(primeraFila);
    const candidatos = candidatosOrg.map((r) => mapCandidato(r, cargo));

    listas.push({
      id: organizacion.id,
      organizacion,
      cargo,
      candidatos,
    });
  }

  // Ordenar por id_organizacion_politica (orden estable y consistente entre columnas)
  listas.sort((a, b) => a.organizacion.id - b.organizacion.id);

  return listas;
}

// ──────────────────────────────────────────────────────────────────────────────
// Función principal
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene todos los datos necesarios para el simulador de cédula.
 * @param departamento - Nombre del departamento en mayúsculas (ej: "LIMA").
 *   Si es undefined, las columnas de senadores regionales y diputados
 *   devuelven array vacío (usuario no ha elegido circunscripción).
 */
export async function getDatosSimulador(
  departamento?: string
): Promise<DatosSimulador> {
  const supabase = createServerClient();

  // SELECT sin join a organizaciones_politicas (sigla/numero_lista no existen en esa tabla)
  // organizacion_politica_nombre viene directamente en la tabla candidatos
  const selectCandidatos = `
    id_hoja_vida,
    nombres,
    apellido_paterno,
    apellido_materno,
    cargo,
    numero_candidato,
    tx_guid_foto,
    estado,
    departamento_postula,
    ubigeo_postula,
    id_organizacion_politica,
    organizacion_politica_nombre
  `;

  // ── 5 queries en paralelo ──────────────────────────────────────────────────

  const [
    presidentes,
    senadoresNac,
    senadoresReg,
    diputadosResult,
    parlamentoAndinoResult,
  ] = await Promise.all([
    // 1. Fórmula presidencial (PRESIDENTE + ambos VP)
    supabase
      .from("candidatos")
      .select(selectCandidatos)
      .eq("id_proceso_electoral", ID_PROCESO)
      .in("cargo", [CARGO.PRESIDENTE, CARGO.VP1, CARGO.VP2])
      .neq("estado", "EXCLUIDO")
      .order("numero_candidato", { ascending: true }),

    // 2. Senadores nacionales: ubigeo_postula = '000000'
    supabase
      .from("candidatos")
      .select(selectCandidatos)
      .eq("id_proceso_electoral", ID_PROCESO)
      .eq("cargo", CARGO.SENADOR)
      .eq("ubigeo_postula", "000000")
      .neq("estado", "EXCLUIDO")
      .order("numero_candidato", { ascending: true }),

    // 3. Senadores regionales: ubigeo_postula != '000000' + departamento
    departamento
      ? supabase
          .from("candidatos")
          .select(selectCandidatos)
          .eq("id_proceso_electoral", ID_PROCESO)
          .eq("cargo", CARGO.SENADOR)
          .neq("ubigeo_postula", "000000")
          .eq("departamento_postula", departamento)
          .neq("estado", "EXCLUIDO")
          .order("numero_candidato", { ascending: true })
      : Promise.resolve({ data: [], error: null }),

    // 4. Diputados por departamento
    departamento
      ? supabase
          .from("candidatos")
          .select(selectCandidatos)
          .eq("id_proceso_electoral", ID_PROCESO)
          .eq("cargo", CARGO.DIPUTADO)
          .eq("departamento_postula", departamento)
          .neq("estado", "EXCLUIDO")
          .order("numero_candidato", { ascending: true })
      : Promise.resolve({ data: [], error: null }),

    // 5. Parlamento Andino (circunscripción nacional)
    supabase
      .from("candidatos")
      .select(selectCandidatos)
      .eq("id_proceso_electoral", ID_PROCESO)
      .eq("cargo", CARGO.PARLAMENTO_ANDINO)
      .neq("estado", "EXCLUIDO")
      .order("numero_candidato", { ascending: true }),
  ]);

  // ── Manejo de errores ──────────────────────────────────────────────────────
  if (presidentes.error) {
    console.error("[candidatos-service] presidentes:", presidentes.error.message);
  }
  if (senadoresNac.error) {
    console.error("[candidatos-service] senadoresNac:", senadoresNac.error.message);
  }
  if (senadoresReg.error) {
    console.error("[candidatos-service] senadoresReg:", senadoresReg.error.message);
  }
  if (diputadosResult.error) {
    console.error("[candidatos-service] diputados:", diputadosResult.error.message);
  }
  if (parlamentoAndinoResult.error) {
    console.error("[candidatos-service] parlamentoAndino:", parlamentoAndinoResult.error.message);
  }

  // ── Construir fórmulas presidenciales ──────────────────────────────────────
  const rowsPresidentes = (presidentes.data ?? []) as unknown as CandidatoRow[];

  const mapaFormulas = new Map<number, CandidatoRow[]>();
  for (const row of rowsPresidentes) {
    const idOrg = row.id_organizacion_politica ?? 0;
    if (!mapaFormulas.has(idOrg)) mapaFormulas.set(idOrg, []);
    mapaFormulas.get(idOrg)!.push(row);
  }

  const formulasPresidenciales: ListaElectoral[] = [];
  for (const [, filas] of mapaFormulas) {
    filas.sort(
      (a, b) => (a.numero_candidato ?? 999) - (b.numero_candidato ?? 999)
    );
    const primeraFila = filas[0];
    if (!primeraFila.id_organizacion_politica) continue;

    const organizacion = mapOrganizacion(primeraFila);
    const candidatos = filas.map((r) => mapCandidato(r, "FORMULA_PRESIDENCIAL"));

    formulasPresidenciales.push({
      id: organizacion.id,
      organizacion,
      cargo: "FORMULA_PRESIDENCIAL",
      candidatos,
      presidente: candidatos.find((c) => c.numeroCandidato === 1),
      vicepresidente1: candidatos.find((c) => c.numeroCandidato === 2),
      vicepresidente2: candidatos.find((c) => c.numeroCandidato === 3),
    });
  }
  formulasPresidenciales.sort((a, b) => a.organizacion.id - b.organizacion.id);

  return {
    formulasPresidenciales,
    senadoresNacionales: agruparEnListas(
      (senadoresNac.data ?? []) as unknown as CandidatoRow[],
      "SENADOR_NACIONAL"
    ),
    senadoresRegionales: agruparEnListas(
      (senadoresReg.data ?? []) as unknown as CandidatoRow[],
      "SENADOR_REGIONAL"
    ),
    diputados: agruparEnListas(
      (diputadosResult.data ?? []) as unknown as CandidatoRow[],
      "DIPUTADO"
    ),
    parlamentoAndino: agruparEnListas(
      (parlamentoAndinoResult.data ?? []) as unknown as CandidatoRow[],
      "PARLAMENTO_ANDINO"
    ),
  };
}
