/**
 * Genera src/data/candidatos-eg2026.json directamente desde la API JNE.
 *
 * Ejecutar: node scripts/generate-from-jne.mjs
 *
 * No requiere Supabase ni .env — tira directamente de la API pública JNE.
 * Usar cuando la API JNE está disponible para tener datos 100% completos.
 *
 * El archivo generado se importa en candidatos-service.ts (datos estáticos,
 * sin llamadas externas en runtime de Vercel).
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const JNE_API = "https://web.jne.gob.pe/serviciovotoinformado/api/votoinf/listarCanditatos";
const ID_PROCESO = 124;

// Orden ONPE (sorteo 12-feb-2026)
const ORDEN_ONPE = {
  3025: 1,  2869: 2,  2941: 3,  2901: 4,  2895: 5,  2961: 6,  2932: 7,
  2921: 8,  2967: 9,  2935: 10, 2956: 11, 2857: 12, 2218: 13, 2931: 15,
  1264: 16, 2731: 17, 2986: 18, 2898: 19, 2985: 20, 1366: 21, 1257: 22,
  2995: 23, 2980: 24, 2933: 25, 2998: 26, 2173: 27, 2924: 28, 2925: 29,
  2927: 30, 14: 31,   2930: 32, 22: 33,   2867: 34, 3024: 35, 2939: 36,
  3023: 37, 2840: 38,
};

// Partidos excluidos por JNE (no aparecen en cédula)
const EXCLUIDOS = new Set([2968]);

console.log(`Descargando candidatos EG ${ID_PROCESO} desde JNE...`);
console.log("(Puede tardar 1-2 minutos)\n");

// Un solo request con tipoCandidato=1 devuelve todos los cargos
process.stdout.write("  Fetching todos los cargos...");
const body = JSON.stringify({ idProceso: ID_PROCESO, tipoCandidato: 1 });
const res = await fetch(JNE_API, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body,
  signal: AbortSignal.timeout(120000),
});
if (!res.ok) { console.log(`\nERROR HTTP ${res.status}`); process.exit(1); }
const json = await res.json();
const raw = (json.data || json || []).filter((r) => r.idProcesoElectoral === ID_PROCESO);
console.log(` ${raw.length} candidatos\n`);

// Filtrar excluidos
const allRows = raw.filter((r) => !EXCLUIDOS.has(r.idOrganizacionPolitica));
console.log(`Después de filtrar excluidos: ${allRows.length}`);

// Mapear al formato usado por candidatos-service.ts
const jneData = allRows.map((r) => ({
  idProcesoElectoral: ID_PROCESO,
  idOrganizacionPolitica: r.idOrganizacionPolitica,
  strOrganizacionPolitica: r.strOrganizacionPolitica ?? null,
  intPosicion: r.intPosicion ?? null,
  idCargo: r.idCargo,
  strCargo: r.strCargo ?? null,
  strNombres: r.strNombres ?? null,
  strApellidoPaterno: r.strApellidoPaterno ?? null,
  strApellidoMaterno: r.strApellidoMaterno ?? null,
  strEstadoCandidato: r.strEstadoCandidato ?? "INSCRITO",
  strGuidFoto: r.strGuidFoto ?? null,
  strNombre: r.strNombre ?? null,
  strUbigeo: r.strUbigeo ?? "000000",
  strDepartamento: r.strDepartamento ?? null,
  strDocumentoIdentidad: String(r.strDocumentoIdentidad ?? ""),
}));

// Verificar cobertura de presidentes vs ORDEN_ONPE
const orgsConPres = new Set(
  jneData.filter((r) => r.idCargo === 1).map((r) => r.idOrganizacionPolitica)
);
const sinPres = Object.keys(ORDEN_ONPE)
  .map(Number)
  .filter((id) => !EXCLUIDOS.has(id) && !orgsConPres.has(id));

if (sinPres.length > 0) {
  console.log(`\nATENCIÓN: ${sinPres.length} partidos sin presidente en JNE: ${sinPres.join(", ")}`);
}

// Distribución final
const dist = {};
for (const r of jneData) dist[r.strCargo || "?"] = (dist[r.strCargo || "?"] || 0) + 1;
console.log("\nDistribución:");
for (const [c, n] of Object.entries(dist).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(5)}  ${c}`);
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
