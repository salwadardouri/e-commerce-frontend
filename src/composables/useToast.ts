import { readonly, ref } from 'vue'

export type ToastTone = 'success' | 'error' | 'info'
export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

const toasts = ref<Toast[]>([])
let nextId = 1

/** Global toast queue, rendered once by <MToastHost />. */
export function useToast() {
  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const push = (message: string, tone: ToastTone = 'info', duration = 3500) => {
    const id = nextId++
    toasts.value = [...toasts.value, { id, message, tone }]
    if (duration > 0) setTimeout(() => dismiss(id), duration)
  }

  return {
    toasts: readonly(toasts),
    dismiss,
    success: (m: string) => push(m, 'success'),
    error: (m: string) => push(m, 'error', 5000),
    info: (m: string) => push(m, 'info'),
  }
}
