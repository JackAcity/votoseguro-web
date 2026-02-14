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

interface OrgRow {
  id_organizacion: number;
  nombre: string;
  sigla: string | null;
  numero_lista: number | null;
}

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
  // Supabase sin schema tipado puede devolver objeto o array en relaciones FK
  organizaciones_politicas: OrgRow | OrgRow[] | null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function fotoUrl(txGuidFoto: string | null | undefined): string | undefined {
  if (!txGuidFoto || txGuidFoto.trim() === "") return undefined;
  // guid viene como "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" o similar
  return `${JNE_FOTO_BASE}/${txGuidFoto.trim()}.jpg`;
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

function resolveOrg(raw: CandidatoRow["organizaciones_politicas"]): OrgRow | null {
  if (!raw) return null;
  // Supabase puede devolver array (cuando infiere sin schema) u objeto
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw;
}

function mapOrganizacion(
  raw: CandidatoRow["organizaciones_politicas"]
): OrganizacionPolitica {
  const org = resolveOrg(raw);
  return {
    id: org?.id_organizacion ?? 0,
    nombre: org?.nombre ?? "Sin nombre",
    sigla: org?.sigla ?? "",
    colorPrimario: "#6B7280", // color neutro — se puede personalizar después
    numeroLista: org?.numero_lista ?? 0,
  };
}

/**
 * Agrupa filas de candidatos por organización política → ListaElectoral[].
 * Para fórmulas presidenciales: el primer candidato es el presidente,
 * segundo = VP1, tercero = VP2 (por numero_candidato ASC).
 */
function agruparEnListas(
  rows: CandidatoRow[],
  cargo: TipoCargo,
  esFormula = false
): ListaElectoral[] {
  // Agrupar por id_organizacion_politica
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

    const orgRaw = candidatosOrg[0].organizaciones_politicas;
    if (!resolveOrg(orgRaw)) continue;

    const organizacion = mapOrganizacion(orgRaw);
    const candidatos = candidatosOrg.map((r) => mapCandidato(r, cargo));

    const lista: ListaElectoral = {
      id: organizacion.id,
      organizacion,
      cargo,
      candidatos,
    };

    if (esFormula) {
      // Mapear presidente y vicepresidentes para acceso directo
      lista.presidente = candidatos.find((c) => c.numeroCandidato === 1);
      lista.vicepresidente1 = candidatos.find((c) => c.numeroCandidato === 2);
      lista.vicepresidente2 = candidatos.find((c) => c.numeroCandidato === 3);
    }

    listas.push(lista);
  }

  // Ordenar listas por numero_lista de la organización
  listas.sort((a, b) => a.organizacion.numeroLista - b.organizacion.numeroLista);

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

  // SELECT base que incluye datos de la organización política
  // Usamos el foreign key id_organizacion_politica → organizaciones_politicas
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
    organizaciones_politicas (
      id_organizacion,
      nombre,
      sigla,
      numero_lista
    )
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
    //    Traemos los 3 cargos y los agrupamos por organización
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

  // ── Manejo de errores (no bloquear render — mostrar datos parciales) ────────
  if (presidentes.error) {
    console.error("[candidatos-service] Error cargando presidentes:", presidentes.error.message);
  }
  if (senadoresNac.error) {
    console.error("[candidatos-service] Error cargando senadores nacionales:", senadoresNac.error.message);
  }
  if (senadoresReg.error) {
    console.error("[candidatos-service] Error cargando senadores regionales:", senadoresReg.error.message);
  }
  if (diputadosResult.error) {
    console.error("[candidatos-service] Error cargando diputados:", diputadosResult.error.message);
  }
  if (parlamentoAndinoResult.error) {
    console.error("[candidatos-service] Error cargando parlamento andino:", parlamentoAndinoResult.error.message);
  }

  // ── Construir fórmulas presidenciales ──────────────────────────────────────
  // Los 3 cargos vienen mezclados → agrupar por org y construir lista única
  const rowsPresidentes = (presidentes.data ?? []) as unknown as CandidatoRow[];

  // Primero extraemos los presidentes (numero_candidato = 1) como base de lista
  const mapa = new Map<number, CandidatoRow[]>();
  for (const row of rowsPresidentes) {
    const idOrg = row.id_organizacion_politica ?? 0;
    if (!mapa.has(idOrg)) mapa.set(idOrg, []);
    mapa.get(idOrg)!.push(row);
  }

  const formulasPresidenciales: ListaElectoral[] = [];
  for (const [, filas] of mapa) {
    filas.sort(
      (a, b) => (a.numero_candidato ?? 999) - (b.numero_candidato ?? 999)
    );
    const orgRaw = filas[0].organizaciones_politicas;
    if (!resolveOrg(orgRaw)) continue;

    const organizacion = mapOrganizacion(orgRaw);
    const candidatos = filas.map((r) =>
      mapCandidato(r, "FORMULA_PRESIDENCIAL")
    );
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
  formulasPresidenciales.sort(
    (a, b) => a.organizacion.numeroLista - b.organizacion.numeroLista
  );

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
