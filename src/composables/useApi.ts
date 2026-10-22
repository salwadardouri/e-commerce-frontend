import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { tokenStorage } from '@/lib/token'

/** Normalised error thrown by every call made through useApi. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    /** Field-level validation messages (HTTP 422) */
    readonly errors: Record<string, string[]> = {},
    /** Raw response body, e.g. the out-of-stock `lines` of a failed checkout */
    readonly data: unknown = null,
  ) {
    super(message)
  }
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/** Called when the API rejects the stored token (expired/revoked) so the auth state can reset. */
let onUnauthorized: (() => void) | null = null
export const setUnauthorizedHandler = (fn: () => void): void => {
  onUnauthorized = fn
}

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const status = error.response?.status ?? 0
    if (status === 401 && tokenStorage.get() && !error.config?.url?.includes('/auth/login')) {
      tokenStorage.clear()
      onUnauthorized?.()
    }
    const body = error.response?.data
    const message =
      body?.message ?? (status === 0 ? 'Impossible de joindre le serveur.' : 'Une erreur est survenue.')

    return Promise.reject(new ApiError(message, status, body?.errors, body))
  },
)

/**
 * Generic CRUD toolbox over axios. Feature hooks (`*.hook.ts`) consume it and never touch axios directly.
 * Every method resolves with the response body (typed) or rejects with an ApiError.
 */
export function useApi() {
  const get = async <T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig) =>
    (await http.get<T>(url, { ...config, params })).data

  const post = async <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    (await http.post<T>(url, body, config)).data

  const put = async <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    (await http.put<T>(url, body, config)).data

  const patch = async <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    (await http.patch<T>(url, body, config)).data

  const remove = async (url: string, config?: AxiosRequestConfig): Promise<void> => {
    await http.delete(url, config)
  }

  /** multipart/form-data upload */
  const upload = async <T>(url: string, file: File, field = 'file') => {
    const form = new FormData()
    form.append(field, file)
    return (await http.post<T>(url, form, { timeout: 60_000 })).data
  }

  return { get, post, put, patch, remove, upload }
}

export type Api = ReturnType<typeof useApi>
