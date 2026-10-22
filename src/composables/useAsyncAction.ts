import { ref } from 'vue'
import { ApiError } from './useApi'
import { useToast } from './useToast'

interface Options<R> {
  /** Success toast (static or computed from the result). */
  success?: string | ((result: R) => string)
  /** Don't show the error toast (the caller renders `error` itself). */
  silent?: boolean
}

/**
 * Wraps an async function with loading/error state and toasts, so components stay free of try/catch.
 * `run` resolves with the result, or `undefined` when it failed (details in `error`).
 */
export function useAsyncAction<A extends unknown[], R>(fn: (...args: A) => Promise<R>, options: Options<R> = {}) {
  const toast = useToast()
  const loading = ref(false)
  const error = ref<ApiError | Error | null>(null)

  const run = async (...args: A): Promise<R | undefined> => {
    loading.value = true
    error.value = null
    try {
      const result = await fn(...args)
      if (options.success) toast.success(typeof options.success === 'function' ? options.success(result) : options.success)
      return result
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      if (!options.silent) toast.error(error.value.message)
      return undefined
    } finally {
      loading.value = false
    }
  }

  return { run, loading, error }
}
