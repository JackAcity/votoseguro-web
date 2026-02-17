/**
 * Mapa de logos de partidos para el simulador.
 *
 * Fuente: imágenes hosteadas en Supabase Storage (bucket: assets/partidos/)
 * Descargadas originalmente del simulador RPP 2026.
 *
 * Clave: id_organizacion_politica
 * Orden según sorteo ONPE — Resolución Jefatural n° 000007-2026-JN/ONPE (12-feb-2026)
 */

const SUPABASE_BASE =
  "https://ixmvqstgbobhqbwxjgjh.supabase.co/storage/v1/object/public/assets/partidos";

export const LOGOS_PARTIDOS: Record<number, string> = {
  3025: `${SUPABASE_BASE}/alianza_venceremos.webp`,                   // 1
  2869: `${SUPABASE_BASE}/partido_patriotico_del_peru.webp`,          // 2
  2941: `${SUPABASE_BASE}/partido_civico_obras.webp`,                 // 3
  2901: `${SUPABASE_BASE}/frepap.webp`,                               // 4 (FREPAP → Dem. Verde)
  2895: `${SUPABASE_BASE}/partido_democrata_verde.webp`,              // 5
  2961: `${SUPABASE_BASE}/partido_del_buen_gobierno.webp`,            // 6
  2932: `${SUPABASE_BASE}/peru_accion.webp`,                          // 7
  2921: `${SUPABASE_BASE}/prin.webp`,                                  // 8
  2967: `${SUPABASE_BASE}/progresemos.webp`,                          // 9
  2935: `${SUPABASE_BASE}/si_creo.webp`,                              // 10
  2956: `${SUPABASE_BASE}/pais_para_todos.webp`,                      // 11
  2857: `${SUPABASE_BASE}/frente_de_la_esperanza.webp`,               // 12
  2218: `${SUPABASE_BASE}/peru_libre.webp`,                           // 13
  2931: `${SUPABASE_BASE}/primero_la_gente.webp`,                     // 15
  1264: `${SUPABASE_BASE}/juntos_por_el_peru.webp`,                   // 16
  2731: `${SUPABASE_BASE}/podemos_peru.webp`,                         // 17
  2986: `${SUPABASE_BASE}/partido_democratico_federal.webp`,          // 18
  2898: `${SUPABASE_BASE}/fe_en_el_peru.webp`,                        // 19
  2985: `${SUPABASE_BASE}/integridad_democratica.webp`,               // 20
  1366: `${SUPABASE_BASE}/fuerza_popular.webp`,                       // 21
  1257: `${SUPABASE_BASE}/alianza_para_el_progreso.webp`,             // 22
  2995: `${SUPABASE_BASE}/cooperacion_popular.webp`,                  // 23
  2980: `${SUPABASE_BASE}/ahora_nacion.webp`,                         // 24
  2933: `${SUPABASE_BASE}/libertad_popular.webp`,                     // 25
  2998: `${SUPABASE_BASE}/un_camino_diferente.webp`,                  // 26
  2173: `${SUPABASE_BASE}/avanza_pais.webp`,                          // 27
  2924: `${SUPABASE_BASE}/peru_moderno.webp`,                         // 28
  2925: `${SUPABASE_BASE}/peru_primero.webp`,                         // 29
  2927: `${SUPABASE_BASE}/salvemos_al_peru.webp`,                     // 30
  14:   `${SUPABASE_BASE}/somos_peru.webp`,                           // 31
  2930: `${SUPABASE_BASE}/partido_aprista_peruano.webp`,              // 32
  22:   `${SUPABASE_BASE}/renovacion_popular.webp`,                   // 33
  2867: `${SUPABASE_BASE}/partido_democrata_unido_peru.webp`,         // 34
  3024: `${SUPABASE_BASE}/alianza_fuerza_y_libertad.webp`,            // 35
  2939: `${SUPABASE_BASE}/partido_trabajadores_emprendedores.webp`,   // 36
  3023: `${SUPABASE_BASE}/alianza_unidad_nacional.webp`,              // 37
  2840: `${SUPABASE_BASE}/partido_morado.webp`,                       // 38
};

/**
 * Obtiene la URL del logo de un partido por su id de organización.
 * Retorna undefined si no hay logo disponible.
 */
export function getLogoPartido(idOrganizacion: number): string | undefined {
  return LOGOS_PARTIDOS[idOrganizacion];
}
