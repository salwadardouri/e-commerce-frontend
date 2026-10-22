import { useApi } from '@/composables/useApi'
import { useAsyncAction } from '@/composables/useAsyncAction'

/** Image upload (admin). Resolves with the stored path, e.g. "/uploads/ab12.webp". */
export function useUploads() {
  const api = useApi()

  const uploadImage = useAsyncAction(async (file: File) => {
    const { url } = await api.upload<{ url: string }>('/uploads', file)
    return url
  })

  return { uploadImage }
}
