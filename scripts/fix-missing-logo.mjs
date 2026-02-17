import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const raw = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
const env = {};
for (const line of raw.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
}

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"];

const rppUrl = "https://s2.rpp-noticias.io/static/especial/simulador-voto/dist/images/partidos/Alianza_Fuerza_y_Libertad/logo_fuerza_y_libertad.webp";

console.log("Descargando logo_fuerza_y_libertad.webp...");
const res = await fetch(rppUrl);
if (!res.ok) { console.error("Download failed:", res.status); process.exit(1); }
const buf = Buffer.from(await res.arrayBuffer());

const uploadUrl = `${SUPABASE_URL}/storage/v1/object/assets/partidos/alianza_fuerza_y_libertad.webp`;
const up = await fetch(uploadUrl, {
  method: "POST",
  headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "image/webp", "x-upsert": "true" },
  body: buf,
});
if (up.ok) {
  console.log(`✅ Subido OK (${(buf.length / 1024).toFixed(1)} KB)`);
} else {
  console.error("Upload error:", up.status, await up.text());
}
