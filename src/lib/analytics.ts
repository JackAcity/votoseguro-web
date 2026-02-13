/**
 * analytics.ts — Captura anónima de intención de voto
 * Sin PII, sin cookies obligatorias, sin auth
 * Ley 29733 (Perú) + GDPR minimización de datos
 */

import { supabase } from './supabase'
import type { ResultadoCedula } from './types'

// ─────────────────────────────────────────────
// Session token: UUID generado una vez por visita
// Guardado en sessionStorage (muere al cerrar tab)
// NO es localStorage (no persiste entre visitas)
// ─────────────────────────────────────────────
function getSessionToken(): string {
  if (typeof window === 'undefined') return ''
  const key = 'vs_session'
  let token = sessionStorage.getItem(key)
  if (!token) {
    token = crypto.randomUUID()
    sessionStorage.setItem(key, token)
  }
  return token
}

// ─────────────────────────────────────────────
// Detectar si es móvil (sin fingerprint)
// ─────────────────────────────────────────────
function esMobil(): boolean {
  if (typeof window === 'undefined') return false
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
}

// ─────────────────────────────────────────────
// Parsear UTMs de la URL actual
// ─────────────────────────────────────────────
function getUTMs() {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source:   params.get('utm_source')   ?? undefined,
    utm_medium:   params.get('utm_medium')   ?? undefined,
    utm_campaign: params.get('utm_campaign') ?? undefined,
    referrer:     document.referrer ? document.referrer.slice(0, 500) : undefined,
  }
}

// ─────────────────────────────────────────────
// Geo liviana via ip-api.com (free, sin API key)
// Solo país + región — NUNCA ciudad ni IP exacta
// Si falla (timeout, bloqueada), no rompemos la app
// ─────────────────────────────────────────────
let geoCache: { pais: string; region: string } | null = null

async function getGeoAproximada(): Promise<{ pais: string; region: string } | null> {
  if (geoCache) return geoCache
  try {
    const res = await fetch('https://ip-api.com/json/?fields=countryCode,regionName', {
      signal: AbortSignal.timeout(3000), // máx 3s — free tier ip-api
    })
    if (!res.ok) return null
    const data = await res.json()
    geoCache = { pais: data.countryCode ?? '', region: data.regionName ?? '' }
    return geoCache
  } catch {
    return null // silencioso — no romper la app si falla geo
  }
}

// ─────────────────────────────────────────────
// initSesion: llamar una vez al cargar el simulador
// ─────────────────────────────────────────────
export async function initSesion(): Promise<string> {
  const token = getSessionToken()
  if (!token) return ''

  const geo = await getGeoAproximada()
  const utms = getUTMs()

  // upsert: si ya existe la sesión, no duplicar
  await supabase.from('sesiones').upsert(
    {
      session_token: token,
      pais:          geo?.pais,
      region:        geo?.region,
      es_movil:      esMobil(),
      ...utms,
    },
    { onConflict: 'session_token', ignoreDuplicates: true }
  )

  return token
}

// ─────────────────────────────────────────────
// registrarIntencionVoto: llamar al hacer "Verificar mi voto"
// ─────────────────────────────────────────────
export async function registrarIntencionVoto(
  resultado: ResultadoCedula,
  selecciones: Record<string, {
    nombreOrganizacion: string
    idOrganizacion?: number
    esBlanco: boolean
    esNulo: boolean
    esValido: boolean
  }>
): Promise<void> {
  const token = getSessionToken()
  if (!token) return

  const geo = await getGeoAproximada()

  // Construir filas — una por columna electoral
  const filas = Object.entries(selecciones).map(([tipoCargo, sel]) => ({
    session_token:           token,
    tipo_cargo:              tipoCargo,
    id_organizacion_politica: sel.idOrganizacion ?? null,
    nombre_organizacion:     sel.nombreOrganizacion,
    es_voto_blanco:          sel.esBlanco,
    es_voto_nulo:            sel.esNulo,
    es_voto_valido:          sel.esValido,
    ubigeo_sesion:           null, // futuro: cuando tengamos ubigeo real
    departamento_sesion:     geo?.region ?? null,
  }))

  if (filas.length === 0) return

  // Insert sin esperar respuesta — fire and forget
  // Si falla (offline, rate limit), la app sigue funcionando
  supabase.from('intenciones_voto').insert(filas).then(({ error }) => {
    if (error && process.env.NODE_ENV === 'development') {
      console.warn('[VotoSeguro Analytics]', error.message)
    }
  })
}
