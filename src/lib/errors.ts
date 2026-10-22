import { ApiError } from '@/composables/useApi'

/** First validation message the API returned for a field (HTTP 422), if any. */
export const fieldError = (error: Error | null | undefined, field: string): string | undefined =>
  error instanceof ApiError ? error.errors[field]?.[0] : undefined
