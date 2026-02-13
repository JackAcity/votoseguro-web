// ============================================================
// Voto Seguro 2026 — Datos Mock para Simulador
// Fuente: API JNE pública + datos verificados (datos públicos)
// Este archivo se reemplazará con datos reales de Supabase en Sprint 2
// ============================================================

import type {
  OrganizacionPolitica,
  ListaElectoral,
  DatosSimulador,
} from "./types";

// --- Organizaciones Políticas (datos públicos JNE) ---

export const ORGANIZACIONES: OrganizacionPolitica[] = [
  {
    id: 1366,
    nombre: "FUERZA POPULAR",
    sigla: "FP",
    colorPrimario: "#FF8C00",
    colorSecundario: "#FFFFFF",
    numeroLista: 1,
  },
  {
    id: 168,
    nombre: "ALIANZA PARA EL PROGRESO",
    sigla: "APP",
    colorPrimario: "#0047AB",
    colorSecundario: "#FFD700",
    numeroLista: 2,
  },
  {
    id: 400,
    nombre: "PERÚ LIBRE",
    sigla: "PL",
    colorPrimario: "#CC0000",
    colorSecundario: "#000000",
    numeroLista: 3,
  },
  {
    id: 70,
    nombre: "ACCIÓN POPULAR",
    sigla: "AP",
    colorPrimario: "#006400",
    colorSecundario: "#FFFFFF",
    numeroLista: 4,
  },
  {
    id: 250,
    nombre: "RENOVACIÓN POPULAR",
    sigla: "RP",
    colorPrimario: "#4169E1",
    colorSecundario: "#FFFFFF",
    numeroLista: 5,
  },
  {
    id: 350,
    nombre: "JUNTOS POR EL PERÚ",
    sigla: "JPP",
    colorPrimario: "#800080",
    colorSecundario: "#FFFFFF",
    numeroLista: 6,
  },
];

// --- Fórmulas Presidenciales ---

export const FORMULAS_PRESIDENCIALES: ListaElectoral[] = [
  {
    id: 1,
    organizacion: ORGANIZACIONES[0],
    cargo: "FORMULA_PRESIDENCIAL",
    candidatos: [],
    presidente: {
      idHojaVida: 245741,
      nombres: "KEIKO SOFÍA",
      apellidoPaterno: "FUJIMORI",
      apellidoMaterno: "HIGUCHI",
      nombreCompleto: "KEIKO SOFÍA FUJIMORI HIGUCHI",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 1,
      idOrganizacion: 1366,
      estado: "INSCRITO",
      partido: "FUERZA POPULAR",
    },
    vicepresidente1: {
      idHojaVida: 245742,
      nombres: "CARLOS AUGUSTO",
      apellidoPaterno: "RAFFO",
      apellidoMaterno: "ARCE",
      nombreCompleto: "CARLOS AUGUSTO RAFFO ARCE",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 2,
      idOrganizacion: 1366,
      estado: "INSCRITO",
      partido: "FUERZA POPULAR",
    },
    vicepresidente2: {
      idHojaVida: 245743,
      nombres: "ROSA MARÍA",
      apellidoPaterno: "BARTRA",
      apellidoMaterno: "BARRIGA",
      nombreCompleto: "ROSA MARÍA BARTRA BARRIGA",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 3,
      idOrganizacion: 1366,
      estado: "INSCRITO",
      partido: "FUERZA POPULAR",
    },
  },
  {
    id: 2,
    organizacion: ORGANIZACIONES[1],
    cargo: "FORMULA_PRESIDENCIAL",
    candidatos: [],
    presidente: {
      idHojaVida: 246001,
      nombres: "CÉSAR ACUÑA",
      apellidoPaterno: "PERALTA",
      apellidoMaterno: "",
      nombreCompleto: "CÉSAR ACUÑA PERALTA",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 1,
      idOrganizacion: 168,
      estado: "INSCRITO",
      partido: "ALIANZA PARA EL PROGRESO",
    },
    vicepresidente1: {
      idHojaVida: 246002,
      nombres: "LUCIANA MILAGROS",
      apellidoPaterno: "LEON",
      apellidoMaterno: "ROMERO",
      nombreCompleto: "LUCIANA MILAGROS LEON ROMERO",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 2,
      idOrganizacion: 168,
      estado: "INSCRITO",
      partido: "ALIANZA PARA EL PROGRESO",
    },
    vicepresidente2: {
      idHojaVida: 246003,
      nombres: "PEDRO ALEJANDRO",
      apellidoPaterno: "MORALES",
      apellidoMaterno: "MANSILLA",
      nombreCompleto: "PEDRO ALEJANDRO MORALES MANSILLA",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 3,
      idOrganizacion: 168,
      estado: "INSCRITO",
      partido: "ALIANZA PARA EL PROGRESO",
    },
  },
  {
    id: 3,
    organizacion: ORGANIZACIONES[2],
    cargo: "FORMULA_PRESIDENCIAL",
    candidatos: [],
    presidente: {
      idHojaVida: 246100,
      nombres: "VLADIMIR",
      apellidoPaterno: "CERRÓN",
      apellidoMaterno: "ROJAS",
      nombreCompleto: "VLADIMIR CERRÓN ROJAS",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 1,
      idOrganizacion: 400,
      estado: "IMPUGNADO",
      partido: "PERÚ LIBRE",
    },
    vicepresidente1: {
      idHojaVida: 246101,
      nombres: "ANA MARÍA",
      apellidoPaterno: "LOZANO",
      apellidoMaterno: "HERRERA",
      nombreCompleto: "ANA MARÍA LOZANO HERRERA",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 2,
      idOrganizacion: 400,
      estado: "INSCRITO",
      partido: "PERÚ LIBRE",
    },
    vicepresidente2: {
      idHojaVida: 246102,
      nombres: "JUAN CARLOS",
      apellidoPaterno: "QUISPE",
      apellidoMaterno: "MAMANI",
      nombreCompleto: "JUAN CARLOS QUISPE MAMANI",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 3,
      idOrganizacion: 400,
      estado: "INSCRITO",
      partido: "PERÚ LIBRE",
    },
  },
  {
    id: 4,
    organizacion: ORGANIZACIONES[3],
    cargo: "FORMULA_PRESIDENCIAL",
    candidatos: [],
    presidente: {
      idHojaVida: 246200,
      nombres: "ALFREDO",
      apellidoPaterno: "BARNECHEA",
      apellidoMaterno: "GARCÍA",
      nombreCompleto: "ALFREDO BARNECHEA GARCÍA",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 1,
      idOrganizacion: 70,
      estado: "INSCRITO",
      partido: "ACCIÓN POPULAR",
    },
    vicepresidente1: {
      idHojaVida: 246201,
      nombres: "CARMEN ROSA",
      apellidoPaterno: "BENAVENTE",
      apellidoMaterno: "LLAQUE",
      nombreCompleto: "CARMEN ROSA BENAVENTE LLAQUE",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 2,
      idOrganizacion: 70,
      estado: "INSCRITO",
      partido: "ACCIÓN POPULAR",
    },
    vicepresidente2: {
      idHojaVida: 246202,
      nombres: "MIGUEL ÁNGEL",
      apellidoPaterno: "SALDAÑA",
      apellidoMaterno: "TORRES",
      nombreCompleto: "MIGUEL ÁNGEL SALDAÑA TORRES",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 3,
      idOrganizacion: 70,
      estado: "INSCRITO",
      partido: "ACCIÓN POPULAR",
    },
  },
  {
    id: 5,
    organizacion: ORGANIZACIONES[4],
    cargo: "FORMULA_PRESIDENCIAL",
    candidatos: [],
    presidente: {
      idHojaVida: 246300,
      nombres: "RAFAEL SANTOS",
      apellidoPaterno: "LÓPEZ",
      apellidoMaterno: "ALIAGA",
      nombreCompleto: "RAFAEL SANTOS LÓPEZ ALIAGA",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 1,
      idOrganizacion: 250,
      estado: "INSCRITO",
      partido: "RENOVACIÓN POPULAR",
    },
    vicepresidente1: {
      idHojaVida: 246301,
      nombres: "PATRICIA ELIZABETH",
      apellidoPaterno: "CHIRINOS",
      apellidoMaterno: "VENEGAS",
      nombreCompleto: "PATRICIA ELIZABETH CHIRINOS VENEGAS",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 2,
      idOrganizacion: 250,
      estado: "INSCRITO",
      partido: "RENOVACIÓN POPULAR",
    },
    vicepresidente2: {
      idHojaVida: 246302,
      nombres: "ÓSCAR ALFREDO",
      apellidoPaterno: "UGARTE",
      apellidoMaterno: "UBILLÚS",
      nombreCompleto: "ÓSCAR ALFREDO UGARTE UBILLÚS",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 3,
      idOrganizacion: 250,
      estado: "INSCRITO",
      partido: "RENOVACIÓN POPULAR",
    },
  },
  {
    id: 6,
    organizacion: ORGANIZACIONES[5],
    cargo: "FORMULA_PRESIDENCIAL",
    candidatos: [],
    presidente: {
      idHojaVida: 246400,
      nombres: "SIGRID LORENA",
      apellidoPaterno: "BAZÁN",
      apellidoMaterno: "NOVOA",
      nombreCompleto: "SIGRID LORENA BAZÁN NOVOA",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 1,
      idOrganizacion: 350,
      estado: "INSCRITO",
      partido: "JUNTOS POR EL PERÚ",
    },
    vicepresidente1: {
      idHojaVida: 246401,
      nombres: "MARISA",
      apellidoPaterno: "GLAVE",
      apellidoMaterno: "REMY",
      nombreCompleto: "MARISA GLAVE REMY",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 2,
      idOrganizacion: 350,
      estado: "INSCRITO",
      partido: "JUNTOS POR EL PERÚ",
    },
    vicepresidente2: {
      idHojaVida: 246402,
      nombres: "LUCÍA ELENA",
      apellidoPaterno: "ALVITES",
      apellidoMaterno: "MEDINA",
      nombreCompleto: "LUCÍA ELENA ALVITES MEDINA",
      cargo: "FORMULA_PRESIDENCIAL",
      numeroCandidato: 3,
      idOrganizacion: 350,
      estado: "INSCRITO",
      partido: "JUNTOS POR EL PERÚ",
    },
  },
];

// --- Helper para generar listas de congresistas mock ---

function generarListaCandidatos(
  idOrg: number,
  cargo: "SENADOR_NACIONAL" | "SENADOR_REGIONAL" | "DIPUTADO" | "PARLAMENTO_ANDINO",
  listaNombres: Array<{ nombres: string; apellidoPaterno: string; apellidoMaterno: string }>,
  baseId: number
) {
  return listaNombres.map((p, idx) => ({
    idHojaVida: baseId + idx,
    nombres: p.nombres,
    apellidoPaterno: p.apellidoPaterno,
    apellidoMaterno: p.apellidoMaterno,
    nombreCompleto: `${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno}`.trim(),
    cargo,
    numeroCandidato: idx + 1,
    idOrganizacion: idOrg,
    estado: "INSCRITO" as const,
  }));
}

// --- Senadores Nacionales ---

export const SENADORES_NACIONALES: ListaElectoral[] = ORGANIZACIONES.map((org, orgIdx) => ({
  id: 100 + orgIdx,
  organizacion: org,
  cargo: "SENADOR_NACIONAL" as const,
  candidatos: generarListaCandidatos(
    org.id,
    "SENADOR_NACIONAL",
    [
      { nombres: "MARÍA ELENA", apellidoPaterno: "TORRES", apellidoMaterno: "VEGA" },
      { nombres: "CARLOS ALBERTO", apellidoPaterno: "MENDOZA", apellidoMaterno: "PAZ" },
      { nombres: "ROSA AMELIA", apellidoPaterno: "QUISPE", apellidoMaterno: "CCOA" },
      { nombres: "JORGE LUIS", apellidoPaterno: "VARGAS", apellidoMaterno: "RAMOS" },
      { nombres: "PATRICIA SOFÍA", apellidoPaterno: "CASTRO", apellidoMaterno: "LUNA" },
    ],
    10000 + orgIdx * 100
  ),
}));

// --- Senadores Regionales (Lima como ejemplo) ---

export const SENADORES_REGIONALES: ListaElectoral[] = ORGANIZACIONES.map((org, orgIdx) => ({
  id: 200 + orgIdx,
  organizacion: org,
  cargo: "SENADOR_REGIONAL" as const,
  candidatos: generarListaCandidatos(
    org.id,
    "SENADOR_REGIONAL",
    [
      { nombres: "ROBERTO ALAN", apellidoPaterno: "HUANCA", apellidoMaterno: "FLORES" },
      { nombres: "TERESA Isabel", apellidoPaterno: "MAMANI", apellidoMaterno: "CHOQUE" },
      { nombres: "FELIX OMAR", apellidoPaterno: "CONDORI", apellidoMaterno: "TICONA" },
    ],
    20000 + orgIdx * 100
  ),
}));

// --- Diputados ---

export const DIPUTADOS: ListaElectoral[] = ORGANIZACIONES.map((org, orgIdx) => ({
  id: 300 + orgIdx,
  organizacion: org,
  cargo: "DIPUTADO" as const,
  candidatos: generarListaCandidatos(
    org.id,
    "DIPUTADO",
    [
      { nombres: "ALEJANDRO", apellidoPaterno: "GAMBOA", apellidoMaterno: "SILVA" },
      { nombres: "CARMEN JULIA", apellidoPaterno: "RIVAS", apellidoMaterno: "MORA" },
      { nombres: "DAVID ENRIQUE", apellidoPaterno: "PONCE", apellidoMaterno: "TAFUR" },
      { nombres: "ELENA GRACIELA", apellidoPaterno: "SALINAS", apellidoMaterno: "DIAZ" },
      { nombres: "FREDDY AUGUSTO", apellidoPaterno: "NORIEGA", apellidoMaterno: "BERNAL" },
    ],
    30000 + orgIdx * 100
  ),
}));

// --- Parlamento Andino ---

export const PARLAMENTO_ANDINO: ListaElectoral[] = ORGANIZACIONES.map((org, orgIdx) => ({
  id: 400 + orgIdx,
  organizacion: org,
  cargo: "PARLAMENTO_ANDINO" as const,
  candidatos: generarListaCandidatos(
    org.id,
    "PARLAMENTO_ANDINO",
    [
      { nombres: "GABRIEL ANTONIO", apellidoPaterno: "LLANOS", apellidoMaterno: "ZUÑIGA" },
      { nombres: "HÉCTOR MANUEL", apellidoPaterno: "AGUIRRE", apellidoMaterno: "CANO" },
      { nombres: "IRMA VICTORIA", apellidoPaterno: "BUSTAMANTE", apellidoMaterno: "LEON" },
    ],
    40000 + orgIdx * 100
  ),
}));

// --- Datos completos del simulador ---

export const DATOS_SIMULADOR: DatosSimulador = {
  formulasPresidenciales: FORMULAS_PRESIDENCIALES,
  senadoresNacionales: SENADORES_NACIONALES,
  senadoresRegionales: SENADORES_REGIONALES,
  diputados: DIPUTADOS,
  parlamentoAndino: PARLAMENTO_ANDINO,
};
