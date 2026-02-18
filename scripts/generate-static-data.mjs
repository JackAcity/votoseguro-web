/**
 * Genera src/data/candidatos-eg2026.json desde Supabase.
 *
 * Ejecutar: node scripts/generate-static-data.mjs
 *
 * Requiere: .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * El archivo generado se importa en candidatos-service.ts (datos estáticos,
 * sin llamadas externas en runtime de Vercel).
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Leer .env.local
const env = {};
readFileSync(resolve(ROOT, ".env.local"), "utf-8")
  .split("\n")
  .forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith("#")) return;
    const eq = line.indexOf("=");
    if (eq < 0) return;
    env[line.slice(0, eq).trim()] = line
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  });

const URL_BASE = env["NEXT_PUBLIC_SUPABASE_URL"];
const KEY = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
if (!URL_BASE || !KEY) {
  console.error("ERROR: Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local");
  process.exit(1);
}
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function fetchAll(path) {
  const all = [];
  let offset = 0;
  while (true) {
    const r = await fetch(`${URL_BASE}/rest/v1/${path}&offset=${offset}&limit=1000`, { headers });
    const rows = await r.json();
    if (!Array.isArray(rows) || rows.length === 0) break;
    all.push(...rows);
    process.stderr.write(`  Fetched ${all.length}...\r`);
    if (rows.length < 1000) break;
    offset += 1000;
  }
  return all;
}

// Orden ONPE (sorteo 12-feb-2026)
const ORDEN_ONPE = {
  3025: 1,  2869: 2,  2941: 3,  2901: 4,  2895: 5,  2961: 6,  2932: 7,
  2921: 8,  2967: 9,  2935: 10, 2956: 11, 2857: 12, 2218: 13, 2931: 15,
  1264: 16, 2731: 17, 2986: 18, 2898: 19, 2985: 20, 1366: 21, 1257: 22,
  2995: 23, 2980: 24, 2933: 25, 2998: 26, 2173: 27, 2924: 28, 2925: 29,
  2927: 30, 14: 31,   2930: 32, 22: 33,   2867: 34, 3024: 35, 2939: 36,
  3023: 37, 2840: 38,
};

// Partido excluido por JNE (no aparece en cédula)
const EXCLUIDOS = new Set([2968]);

const CARGO_MAP = {
  "PRESIDENTE DE LA REPÚBLICA": 1,
  "PRIMER VICEPRESIDENTE DE LA REPÚBLICA": 2,
  "SEGUNDO VICEPRESIDENTE DE LA REPÚBLICA": 3,
  "REPRESENTANTE ANTE EL PARLAMENTO ANDINO": 5,
  DIPUTADO: 15,
  SENADOR: 16,
};

console.log("Fetching candidatos from Supabase...");
const [rows, orgs] = await Promise.all([
  fetchAll(
    "candidatos?select=id_hoja_vida,id_proceso_electoral,id_organizacion_politica,nombres,apellido_paterno,apellido_materno,cargo,numero_candidato,estado,tx_guid_foto,tx_nombre_archivo,organizacion_politica_nombre,ubigeo_postula,departamento_postula&id_proceso_electoral=eq.124"
  ),
  fetch(`${URL_BASE}/rest/v1/organizaciones_politicas?limit=100`, { headers }).then((r) => r.json()),
]);
console.log(`\nCandidatos: ${rows.length}, Organizaciones: ${orgs.length}`);

// Mapear a formato JNE-compatible
const jneData = rows
  .map((r) => ({
    idProcesoElectoral: 124,
    idOrganizacionPolitica: r.id_organizacion_politica,
    strOrganizacionPolitica: r.organizacion_politica_nombre,
    intPosicion: r.numero_candidato,
    idCargo: CARGO_MAP[r.cargo] ?? 0,
    strCargo: r.cargo,
    strNombres: r.nombres,
    strApellidoPaterno: r.apellido_paterno,
    strApellidoMaterno: r.apellido_materno,
    strEstadoCandidato: r.estado,
    strGuidFoto: r.tx_guid_foto,
    strNombre: r.tx_nombre_archivo,
    strUbigeo: r.ubigeo_postula,
    strDepartamento: r.departamento_postula,
    strDocumentoIdentidad: String(r.id_hoja_vida ?? ""),
  }))
  .filter((r) => r.idCargo > 0);

// Agregar stubs para partidos sin presidente en Supabase
const orgsWithPres = new Set(
  jneData.filter((r) => r.idCargo === 1).map((r) => r.idOrganizacionPolitica)
);
let added = 0;
for (const [idOrgStr, pos] of Object.entries(ORDEN_ONPE)) {
  const idOrg = parseInt(idOrgStr);
  if (EXCLUIDOS.has(idOrg) || orgsWithPres.has(idOrg)) continue;
  const org = orgs.find((o) => o.id_organizacion === idOrg);
  jneData.push({
    idProcesoElectoral: 124,
    idOrganizacionPolitica: idOrg,
    strOrganizacionPolitica: org?.nombre ?? "SIN NOMBRE",
    intPosicion: 1,
    idCargo: 1,
    strCargo: "PRESIDENTE DE LA REPÚBLICA",
    strNombres: "",
    strApellidoPaterno: "",
    strApellidoMaterno: "",
    strEstadoCandidato: "INSCRITO",
    strGuidFoto: null,
    strNombre: null,
    strUbigeo: "000000",
    strDepartamento: null,
    strDocumentoIdentidad: "",
  });
  added++;
}
console.log(`Added ${added} stub presidential entries`);

// Distribución final
const dist = {};
for (const r of jneData) dist[r.strCargo] = (dist[r.strCargo] || 0) + 1;
console.log("\nDistribución:");
for (const [c, n] of Object.entries(dist).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${n.toString().padStart(5)}  ${c}`);
}
console.log(`  TOTAL: ${jneData.length}`);

// Guardar
const outDir = resolve(ROOT, "src/data");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "candidatos-eg2026.json");
writeFileSync(outPath, JSON.stringify(jneData));
const sizeKB = Math.round(JSON.stringify(jneData).length / 1024);
console.log(`\nEscrito: ${outPath} (${sizeKB} KB)`);
console.log("Listo. Ejecuta 'npm run build' para generar el bundle actualizado.");
