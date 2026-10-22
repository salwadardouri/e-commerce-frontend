import { computed, ref } from 'vue'
import { setUnauthorizedHandler, useApi } from '@/composables/useApi'
import { useAsyncAction } from '@/composables/useAsyncAction'
import { tokenStorage } from '@/lib/token'
import type { User } from '@/types/models'

interface LoginResponse {
  token: string
  expiresAt: string
  user: User
}

// Module-level state: one session shared by the whole app.
const user = ref<User | null>(null)
const hasToken = ref(Boolean(tokenStorage.get()))
let initPromise: Promise<void> | null = null

const reset = () => {
  tokenStorage.clear()
  hasToken.value = false
  user.value = null
}
setUnauthorizedHandler(reset)

export function useAuth() {
  const api = useApi()

  /** Restores the session from the stored token (once). Router guards await it. */
  const init = (): Promise<void> => {
    initPromise ??= (async () => {
      if (!tokenStorage.get()) return
      try {
        user.value = await api.get<User>('/auth/me')
      } catch {
        reset()
      }
    })()
    return initPromise
  }

  const login = useAsyncAction(
    async (email: string, password: string) => {
      const res = await api.post<LoginResponse>('/auth/login', { email, password })
      tokenStorage.set(res.token)
      hasToken.value = true
      user.value = res.user
      return res.user
    },
    { silent: true },
  )

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      /* token already invalid: nothing to revoke */
    }
    reset()
  }

  return {
    user,
    isLoggedIn: computed(() => hasToken.value && user.value !== null),
    isAdmin: computed(() => user.value?.roles.includes('ROLE_ADMIN') ?? false),
    init,
    login,
    logout,
  }
}
