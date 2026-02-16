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
// IMPORTANTE: La extensión correcta es .jpeg (no .jpg) — verificado 2026-02-14
// Formato: https://mpesije.jne.gob.pe/apidocs/{tx_guid_foto}.jpeg
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
// Orden oficial de las organizaciones políticas en la cédula — Sorteo ONPE
// Acto público del 12 de febrero de 2026 (Resolución Jefatural n° 000007-2026-JN/ONPE)
// Fuente: https://www.onpe.gob.pe (nota de prensa 12-feb-2026)
//
// IMPORTANTE (ONPE, diseño aprobado):
// - La cédula oficial NO incluye números que identifiquen a las organizaciones.
// - Solo muestra: nombre del partido + símbolo + foto del candidato (solo columna presidencial).
// - Este mapa se usa únicamente para ordenar las filas en el simulador de forma
//   idéntica a la cédula oficial.
//
// Partido Ciudadanos por el Perú (posición 14, id 2968) fue excluido por el JNE;
// su espacio queda en blanco en la cédula oficial. En el simulador se omite.
// ──────────────────────────────────────────────────────────────────────────────
const ORDEN_ONPE: Record<number, number> = {
  3025: 1,   // Alianza Electoral Venceremos
  2869: 2,   // Partido Patriótico del Perú
  2941: 3,   // Partido Cívico Obras
  2901: 4,   // Frente Popular Agrícola FIA del Perú (FREPAP)
  2895: 5,   // Partido Demócrata Verde
  2961: 6,   // Partido del Buen Gobierno
  2932: 7,   // Partido Político Perú Acción
  2921: 8,   // Partido Político PRIN
  2967: 9,   // Partido Político Progresemos
  2935: 10,  // Partido Sí Creo
  2956: 11,  // Partido País para Todos
  2857: 12,  // Frente de la Esperanza 2021
  2218: 13,  // Partido Político Nacional Perú Libre
  // 2968: 14 ← Ciudadanos por el Perú (excluido JNE — espacio en blanco en cédula oficial)
  2931: 15,  // Primero la Gente - Comunidad, Ecología, Libertad y Progreso
  1264: 16,  // Partido Juntos Por el Perú
  2731: 17,  // Partido Político Podemos Perú
  2986: 18,  // Partido Democrático Federal
  2898: 19,  // Partido Fe en el Perú
  2985: 20,  // Partido Político Integridad Democrática
  1366: 21,  // Fuerza Popular
  1257: 22,  // Alianza para el Progreso
  2995: 23,  // Partido Político Cooperación Popular
  2980: 24,  // Ahora Nación - AN
  2933: 25,  // Libertad Popular
  2998: 26,  // Un Camino Diferente
  2173: 27,  // Avanza País – Partido de Integración Social
  2924: 28,  // Perú Moderno
  2925: 29,  // Partido Político Perú Primero
  2927: 30,  // Salvemos al Perú
  14:   31,  // Partido Democrático Somos Perú
  2930: 32,  // Partido Aprista Peruano
  22:   33,  // Renovación Popular
  2867: 34,  // Partido Demócrata Unido Perú
  3024: 35,  // Fuerza y Libertad
  2939: 36,  // Partido de los Trabajadores y Emprendedores PTE
  3023: 37,  // Unidad Nacional
  2840: 38,  // Partido Morado
};

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
  return `${JNE_FOTO_BASE}/${txGuidFoto.trim()}.jpeg`;
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

function mapOrganizacion(
  row: CandidatoRow,
  numeroLista: number
): OrganizacionPolitica {
  const nombre = row.organizacion_politica_nombre ?? "Sin nombre";
  return {
    id: row.id_organizacion_politica ?? 0,
    nombre,
    sigla: generarSigla(nombre),
    colorPrimario: "#6B7280", // neutro — personalizable después
    numeroLista,
  };
}

/**
 * Agrupa filas de candidatos por organización política → ListaElectoral[].
 * @param mapaNumeros - Mapa global id_org → numero_lista para consistencia entre columnas.
 */
function agruparEnListas(
  rows: CandidatoRow[],
  cargo: TipoCargo,
  mapaNumeros: Map<number, number>
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

    const numLista = mapaNumeros.get(primeraFila.id_organizacion_politica) ?? 0;
    const organizacion = mapOrganizacion(primeraFila, numLista);
    const candidatos = candidatosOrg.map((r) => mapCandidato(r, cargo));

    listas.push({
      id: organizacion.id,
      organizacion,
      cargo,
      candidatos,
    });
  }

  // Ordenar por numero_lista (orden secuencial consistente)
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

  // ── 6 queries en paralelo ──────────────────────────────────────────────────

  const [
    presidentes,
    senadoresNac,
    senadoresReg,
    diputadosResult,
    parlamentoAndinoResult,
    todasOrgsResult,
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

    // 6. Todos los id_organizacion_politica del proceso (para mapa global estable)
    // Solo necesitamos id y nombre — sin filtro de departamento ni cargo
    // Usamos numero_candidato=1 para reducir volumen (1 fila por org es suficiente)
    supabase
      .from("candidatos")
      .select("id_organizacion_politica,organizacion_politica_nombre")
      .eq("id_proceso_electoral", ID_PROCESO)
      .eq("numero_candidato", 1)
      .neq("estado", "EXCLUIDO"),
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
  if (todasOrgsResult.error) {
    console.error("[candidatos-service] todasOrgs:", todasOrgsResult.error.message);
  }

  // ── Construir mapa global id_org → posición_onpe ──────────────────────────
  // Usamos el orden oficial del sorteo ONPE (12-feb-2026).
  // Para partidos no contemplados en el sorteo (edge case), les asignamos
  // posición 999 para que aparezcan al final sin romper el orden.
  // todasOrgsResult se sigue usando para detectar partidos no mapeados.
  const todasLasRows = (todasOrgsResult.data ?? []) as unknown as CandidatoRow[];

  const idsEnBD = [...new Set(
    todasLasRows
      .map((r) => r.id_organizacion_politica)
      .filter((id): id is number => id !== null && id !== undefined)
  )];

  // Mapa: id_organizacion_politica → posición en cédula (según sorteo ONPE)
  const mapaNumeros = new Map<number, number>();
  for (const id of idsEnBD) {
    mapaNumeros.set(id, ORDEN_ONPE[id] ?? 999);
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

    const numLista = mapaNumeros.get(primeraFila.id_organizacion_politica) ?? 0;
    const organizacion = mapOrganizacion(primeraFila, numLista);
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
  formulasPresidenciales.sort(
    (a, b) => a.organizacion.numeroLista - b.organizacion.numeroLista
  );

  return {
    formulasPresidenciales,
    senadoresNacionales: agruparEnListas(
      (senadoresNac.data ?? []) as unknown as CandidatoRow[],
      "SENADOR_NACIONAL",
      mapaNumeros
    ),
    senadoresRegionales: agruparEnListas(
      (senadoresReg.data ?? []) as unknown as CandidatoRow[],
      "SENADOR_REGIONAL",
      mapaNumeros
    ),
    diputados: agruparEnListas(
      (diputadosResult.data ?? []) as unknown as CandidatoRow[],
      "DIPUTADO",
      mapaNumeros
    ),
    parlamentoAndino: agruparEnListas(
      (parlamentoAndinoResult.data ?? []) as unknown as CandidatoRow[],
      "PARLAMENTO_ANDINO",
      mapaNumeros
    ),
  };
}
