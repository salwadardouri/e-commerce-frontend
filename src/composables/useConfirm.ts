import { readonly, ref } from 'vue'

export interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  tone?: 'danger' | 'primary'
}

interface Pending extends ConfirmOptions {
  resolve: (ok: boolean) => void
}

const pending = ref<Pending | null>(null)

/** Promise-based confirmation dialog: `if (await confirm({ title: 'Supprimer ?' })) …`. Rendered by <ConfirmHost />. */
export function useConfirm() {
  const confirm = (options: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      pending.value?.resolve(false)
      pending.value = { ...options, resolve }
    })

  const answer = (ok: boolean) => {
    pending.value?.resolve(ok)
    pending.value = null
  }

  return { confirm, pending: readonly(pending), answer }
}
