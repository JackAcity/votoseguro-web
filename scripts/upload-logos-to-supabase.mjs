/**
 * Script: upload-logos-to-supabase.mjs
 *
 * Descarga los logos de partidos desde el CDN de RPP y los sube al bucket
 * "assets" de Supabase Storage bajo la carpeta "partidos/".
 *
 * Uso:
 *   node scripts/upload-logos-to-supabase.mjs
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 *
 * El bucket "assets" debe existir (crearlo en el dashboard con acceso público).
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── Leer .env.local manualmente (sin dependencia en dotenv) ──────────────────
function loadEnv() {
  try {
    const raw = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
    const env = {};
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = val;
    }
    return env;
  } catch {
    console.error("❌  No se encontró .env.local. Copia .env.example a .env.local y rellena las variables.");
    process.exit(1);
  }
}

const env = loadEnv();
const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SERVICE_KEY || SERVICE_KEY.startsWith("eyJ") === false) {
  console.error("❌  NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configurados en .env.local");
  process.exit(1);
}

// ── Lista completa de logos (RPP CDN path → nombre local) ────────────────────
const RPP_BASE = "https://s2.rpp-noticias.io/static/especial/simulador-voto/dist/images/partidos";
const BUCKET = "assets";
const STORAGE_FOLDER = "partidos";

/**
 * Cada entrada:
 *   { rppPath, localName, orgIds }
 *
 * rppPath   → ruta relativa en CDN RPP
 * localName → nombre de archivo que usaremos en Supabase Storage
 * orgIds    → ids de organización en nuestro DB que usan este logo
 */
const LOGOS = [
  { rppPath: "Alianza_Venceremos/logo_alianza_venceremos.webp",                          localName: "alianza_venceremos.webp",                         orgIds: [3025] },
  { rppPath: "Partido_Patriotico_del_Peru/logo_ppp.webp",                                localName: "partido_patriotico_del_peru.webp",                 orgIds: [2869] },
  { rppPath: "Partido_Civico_Obras/logo_partido_civico_obras.webp",                      localName: "partido_civico_obras.webp",                        orgIds: [2941] },
  { rppPath: "frepap/frepap.webp",                                                        localName: "frepap.webp",                                      orgIds: [2901] },
  { rppPath: "Partido_Democrata_Verde/logo_partido_democrata_verde.webp",                localName: "partido_democrata_verde.webp",                     orgIds: [2895] },
  { rppPath: "Partido_del_Buen_Gobierno/logo_partido_del_buen_gobierno.webp",            localName: "partido_del_buen_gobierno.webp",                   orgIds: [2961] },
  { rppPath: "Peru_Accion/logo_peru_accion.webp",                                         localName: "peru_accion.webp",                                 orgIds: [2932] },
  { rppPath: "PRIN/logo_prin.webp",                                                       localName: "prin.webp",                                        orgIds: [2921] },
  { rppPath: "Progresemos/logo_progresemos.webp?V=2",                                    localName: "progresemos.webp",                                 orgIds: [2967] },
  { rppPath: "Si_Creo/logo_si_creo.webp",                                                 localName: "si_creo.webp",                                     orgIds: [2935] },
  { rppPath: "Pais_para_Todos/logo_pais_para_todos.webp",                                localName: "pais_para_todos.webp",                             orgIds: [2956] },
  { rppPath: "Frente_de_la_Esperanza/logo_Frente_de_la_Esperanza.webp",                 localName: "frente_de_la_esperanza.webp",                      orgIds: [2857] },
  { rppPath: "Peru_Libre/logo_peru_libre.webp",                                           localName: "peru_libre.webp",                                  orgIds: [2218] },
  { rppPath: "Primero_la_Gente/logo_primero_la_gente.webp",                              localName: "primero_la_gente.webp",                            orgIds: [2931] },
  { rppPath: "Juntos_por_el_Peru/logo_juntos_por_el_peru.webp",                          localName: "juntos_por_el_peru.webp",                          orgIds: [1264] },
  { rppPath: "Podemos_Peru/logo_podemos_peru.webp",                                       localName: "podemos_peru.webp",                                orgIds: [2731] },
  { rppPath: "Partido_Democratico_Federal/logo_partido_democratico_federal.webp",        localName: "partido_democratico_federal.webp",                 orgIds: [2986] },
  { rppPath: "Fe_en_el_Peru/logo_Fe_en_el_Peru.webp",                                    localName: "fe_en_el_peru.webp",                               orgIds: [2898] },
  { rppPath: "Integridad_Democratica/logo_integridad_democratica.webp",                  localName: "integridad_democratica.webp",                      orgIds: [2985] },
  { rppPath: "Fuerza_Popular/logo_fuerza_popular.webp",                                  localName: "fuerza_popular.webp",                              orgIds: [1366] },
  { rppPath: "Alianza_para_el_Progreso/logo_alianza_para_el_progreso.webp",              localName: "alianza_para_el_progreso.webp",                    orgIds: [1257] },
  { rppPath: "Cooperacion_Popular/logo_cooperacion_popular.webp?v=2",                   localName: "cooperacion_popular.webp",                         orgIds: [2995] },
  { rppPath: "Ahora_Nacion/logo_ahora_nacion.webp",                                      localName: "ahora_nacion.webp",                                orgIds: [2980] },
  { rppPath: "Libertad_Popular/logo_libertad_popular.webp",                              localName: "libertad_popular.webp",                            orgIds: [2933] },
  { rppPath: "Un_Camino_Diferente/logo_un_camino_diferente.webp",                        localName: "un_camino_diferente.webp",                         orgIds: [2998] },
  { rppPath: "Avanza_Pais/logo_avanza_pais.webp",                                         localName: "avanza_pais.webp",                                 orgIds: [2173] },
  { rppPath: "Peru_Moderno/logo_peru_moderno.webp",                                       localName: "peru_moderno.webp",                                orgIds: [2924] },
  { rppPath: "Peru_Primero/logo_peru_primero.webp",                                       localName: "peru_primero.webp",                                orgIds: [2925] },
  { rppPath: "Salvemos_al_Peru/logo_salvemos_al_peru.webp",                              localName: "salvemos_al_peru.webp",                            orgIds: [2927] },
  { rppPath: "Somos_Peru/logo_somos_peru.webp",                                           localName: "somos_peru.webp",                                  orgIds: [14] },
  { rppPath: "Partido_Aprista_Peruano/logo_partido_aprista_peruano.webp",               localName: "partido_aprista_peruano.webp",                     orgIds: [2930] },
  { rppPath: "Renovacion_Popular/logo_renovacion_popular.webp",                          localName: "renovacion_popular.webp",                          orgIds: [22] },
  { rppPath: "Partido_Democrata_Unido_Peru/logo_partido_democrata_unido_peru.webp",     localName: "partido_democrata_unido_peru.webp",                orgIds: [2867] },
  { rppPath: "Alianza_Fuerza_y_Libertad/logo_alianza_fuerza_y_libertad.webp",           localName: "alianza_fuerza_y_libertad.webp",                   orgIds: [3024] },
  { rppPath: "Partido_de_los_Trabajadores_y_Emprendedores/logo_partido_de_los_trabajadores_y_emprendedores.webp", localName: "partido_trabajadores_emprendedores.webp", orgIds: [2939] },
  { rppPath: "Alianza_Unidad_Nacional/logo_alianza_unidad_nacional.webp",               localName: "alianza_unidad_nacional.webp",                     orgIds: [3023] },
  { rppPath: "Partido_Morado/logo_partido_morado.webp",                                  localName: "partido_morado.webp",                              orgIds: [2840] },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fetchImageBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar ${url}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

async function uploadToSupabase(buffer, storagePath, contentType = "image/webp") {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": contentType,
      "x-upsert": "true", // reemplaza si ya existe
    },
    body: buffer,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase upload error ${res.status}: ${text}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log(`\n🚀  Iniciando descarga y subida de ${LOGOS.length} logos a Supabase Storage\n`);
console.log(`   Bucket : ${BUCKET}`);
console.log(`   Carpeta: ${STORAGE_FOLDER}/`);
console.log(`   Proyecto: ${SUPABASE_URL}\n`);

const results = [];

for (const logo of LOGOS) {
  const rppUrl = `${RPP_BASE}/${logo.rppPath}`;
  const storagePath = `${STORAGE_FOLDER}/${logo.localName}`;
  process.stdout.write(`  ↓ ${logo.localName.padEnd(55)} `);

  try {
    const buffer = await fetchImageBuffer(rppUrl);
    const publicUrl = await uploadToSupabase(buffer, storagePath);
    process.stdout.write(`✅  (${(buffer.length / 1024).toFixed(1)} KB)\n`);
    results.push({ localName: logo.localName, orgIds: logo.orgIds, publicUrl, ok: true });
  } catch (err) {
    process.stdout.write(`❌  ${err.message}\n`);
    results.push({ localName: logo.localName, orgIds: logo.orgIds, publicUrl: null, ok: false, error: err.message });
  }
}

// ── Imprimir mapa para partidos-logos.ts ────────────────────────────────────

console.log("\n\n📋  COPIA ESTO EN src/lib/partidos-logos.ts:\n");
console.log(`const SUPABASE_BASE = "${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${STORAGE_FOLDER}";\n`);
console.log("export const LOGOS_PARTIDOS: Record<number, string> = {");

for (const r of results) {
  if (!r.ok) continue;
  const path = `\`\${SUPABASE_BASE}/${r.localName}\``;
  for (const id of r.orgIds) {
    console.log(`  ${String(id).padEnd(6)}: ${path},`);
  }
}
console.log("};");

// ── Resumen ──────────────────────────────────────────────────────────────────
const ok = results.filter((r) => r.ok).length;
const fail = results.filter((r) => !r.ok).length;
console.log(`\n✅  ${ok} logos subidos correctamente`);
if (fail > 0) {
  console.log(`❌  ${fail} fallaron:`);
  results.filter((r) => !r.ok).forEach((r) => console.log(`   - ${r.localName}: ${r.error}`));
}
console.log();
