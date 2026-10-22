import type { LineStatus, OrderStatus } from '@/types/models'

const currency = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
const dateTime = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

export const formatPrice = (value: number | null | undefined): string => currency.format(value ?? 0)
export const formatDate = (iso: string): string => dateTime.format(new Date(iso))

const ASSET_BASE = (import.meta.env.VITE_ASSET_URL ?? '').replace(/\/$/, '')

/** Resolves an uploaded image path ("/uploads/x.png") against the API origin; absolute URLs pass through. */
export const assetUrl = (path: string | null | undefined): string => {
  if (!path) return ''
  return /^(https?:|data:|blob:)/.test(path) ? path : `${ASSET_BASE}${path}`
}

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: Tone }> = {
  pending: { label: 'En attente', tone: 'warning' },
  confirmed: { label: 'Confirmée', tone: 'brand' },
  shipped: { label: 'Expédiée', tone: 'brand' },
  delivered: { label: 'Livrée', tone: 'success' },
  cancelled: { label: 'Annulée', tone: 'danger' },
}

export const ORDER_STATUS_OPTIONS = (Object.keys(ORDER_STATUS) as OrderStatus[]).map((value) => ({
  value,
  label: ORDER_STATUS[value].label,
}))

export const LINE_STATUS_LABEL: Record<Exclude<LineStatus, 'ok'>, string> = {
  out_of_stock: 'Rupture de stock',
  insufficient_stock: 'Stock insuffisant',
  unavailable: 'Indisponible',
}
