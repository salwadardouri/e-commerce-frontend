const KEY = 'vitrine.token'

/** Bearer-token persistence. Kept outside the auth hook so useApi can read it without a circular import. */
export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(KEY)
    } catch {
      return null
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(KEY, token)
    } catch {
      /* private mode: session-only */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  },
}
